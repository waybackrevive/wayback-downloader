#!/usr/bin/env python3
"""Cart abandonment recovery — background scheduler.

Runs every 15 minutes and sends recovery emails to users who captured
their email at checkout but never completed payment.

Timeline:
  T+1h  → first recovery email   (recoverySentCount: 0 → 1)
  T+24h → final email + mark Abandoned  (recoverySentCount: 1 → 2)

Multi-worker safety: uses an atomic DB update with a WHERE condition on
recoverySentCount so only one Gunicorn worker sends each email even when
all workers run the check simultaneously.
"""

import logging
from datetime import datetime, timedelta

log = logging.getLogger(__name__)

FIRST_EMAIL_HOURS = 1
FINAL_EMAIL_HOURS = 24
LOOKBACK_DAYS = 7   # don't scan sessions older than this


def start_scheduler(app):
    """Start APScheduler background scheduler.  No-op in TESTING mode."""
    if app.config.get("TESTING"):
        return None

    try:
        from apscheduler.schedulers.background import BackgroundScheduler
        from apscheduler.executors.pool import ThreadPoolExecutor

        executors = {"default": ThreadPoolExecutor(1)}
        job_defaults = {"coalesce": True, "max_instances": 1}

        scheduler = BackgroundScheduler(
            executors=executors,
            job_defaults=job_defaults,
        )
        scheduler.add_job(
            func=run_abandonment_check,
            trigger="interval",
            minutes=15,
            id="abandonment_check",
            replace_existing=True,
            args=[app],
            misfire_grace_time=300,
        )
        scheduler.start()
        log.info("Cart abandonment scheduler started")
        return scheduler
    except Exception as exc:
        log.error("Failed to start abandonment scheduler: %s", exc)
        return None


def run_abandonment_check(app):
    """Query for sessions with captured emails and no payment, then act."""
    from src.model.orm import WhopSession, Restore, Status
    from src.config import db

    with app.app_context():
        try:
            now = datetime.utcnow()
            lookback_cutoff = now - timedelta(days=LOOKBACK_DAYS)

            sessions = (
                WhopSession.query
                .filter(WhopSession.email.isnot(None))
                .filter(WhopSession.email != "")
                .filter(WhopSession.paymentId.is_(None))
                .filter(WhopSession.createdAt.isnot(None))
                .filter(WhopSession.createdAt >= lookback_cutoff)
                .filter(WhopSession.recoverySentCount < 2)
                .all()
            )

            awaiting_status = Status.query.filter_by(status="Awaiting Payment").first()
            abandoned_status = Status.query.filter_by(status="Abandoned").first()
            awaiting_id = awaiting_status.id if awaiting_status else 1
            abandoned_id = abandoned_status.id if abandoned_status else 7

            for session in sessions:
                try:
                    elapsed_hours = (now - session.createdAt).total_seconds() / 3600

                    pending = Restore.query.filter_by(
                        sessionId=session.sessionId, statusId=awaiting_id
                    ).all()

                    if not pending:
                        continue

                    if elapsed_hours >= FINAL_EMAIL_HOURS and session.recoverySentCount < 2:
                        _handle_final(app, db, session, pending, abandoned_id)

                    elif elapsed_hours >= FIRST_EMAIL_HOURS and session.recoverySentCount == 0:
                        _handle_first(app, db, session, pending)

                except Exception as exc:
                    log.error("Error processing session %s: %s", session.sessionId, exc)

        except Exception as exc:
            log.error("Abandonment check failed: %s", exc)


def _handle_first(app, db, session, pending):
    """Send the first recovery email (T+1h)."""
    # Atomic increment: only proceed if we win the race
    rows_updated = (
        WhopSession.query
        .filter_by(sessionId=session.sessionId, recoverySentCount=0)
        .update({"recoverySentCount": 1})
    )
    db.session.commit()

    if rows_updated == 1:
        _send_abandonment_email(app, session, pending, final=False)
        log.info("First recovery email sent — session=%s email=%s",
                 session.sessionId, session.email)


def _handle_final(app, db, session, pending, abandoned_id):
    """Send the final recovery email (T+24h) and mark restores abandoned."""
    current_count = session.recoverySentCount
    rows_updated = (
        WhopSession.query
        .filter_by(sessionId=session.sessionId, recoverySentCount=current_count)
        .update({"recoverySentCount": 2})
    )
    db.session.commit()

    if rows_updated == 1:
        _send_abandonment_email(app, session, pending, final=True)
        Restore.query.filter_by(sessionId=session.sessionId, statusId=pending[0].statusId).update(
            {"statusId": abandoned_id}
        )
        db.session.commit()
        log.info("Final recovery email sent + marked abandoned — session=%s email=%s",
                 session.sessionId, session.email)


def _send_abandonment_email(app, session, restores, final=False):
    """Render template and dispatch via SES."""
    from src.controllers.api import send_email
    from src.lib.common import load_page

    try:
        items = [{"domain": r.domain, "timestamp": r.timestamp} for r in restores]
        count = len(items)
        cart_value = 29.0 + max(0, count - 1) * 19.0

        context = {
            "items": items,
            "cartValue": "${:.2f}".format(cart_value),
            "checkoutUrl": session.checkoutUrl or "https://wayback.download/order",
            "email": session.email,
        }

        if final:
            subject = "Last chance \u2014 complete your website restore"
            template = "abandonment_final"
        else:
            subject = "You left something behind \u2014 your restore is waiting"
            template = "abandonment_recovery"

        html = load_page(template, **context)
        send_email(
            subject=subject,
            body="Complete your website restore: %s" % context["checkoutUrl"],
            recipient=session.email,
            html=html,
            type="html",
        )
    except Exception as exc:
        log.error("Failed to send abandonment email to %s: %s", session.email, exc)
