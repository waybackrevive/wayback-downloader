var app = Elm.Main.init({
    flags: {
        year: new Date().getFullYear(),
        storage: JSON.parse(localStorage.getItem("storage"))
    }
})

app.ports.sendMessage.subscribe(function (message) {
    switch (message.action) {
        case "showModal":
        case "hideModal":
            $("#domain").popover("dispose");
            $("#" + message.id).modal();
            break;
        case "popoverMessage":
            $("#domain").popover("dispose");
            $("#domain").popover({
                title: message.popover.title,
                content: message.popover.content,
                placement: message.popover.placement,
            }).popover("show");
            setTimeout(function () {
                $("#domain").popover("dispose");
            }, 2000);
            break;
        case "resetCaptcha":
            hcaptcha.reset();
            break;
        case "getCaptchaResponse":
            app.ports.messageReceiver.send(hcaptcha.getResponse());
            break;
        case "stripeRedirect":
            // Redirect to Whop checkout URL (now handled via Browser.Navigation.load in Elm)
            if (message.id && message.id.startsWith("http")) {
                window.location.href = message.id;
            }
            break;
        default:
            break;
    }
});

app.ports.loadCaptcha.subscribe(async function () {
    requestAnimationFrame(function () {
        try { hcaptcha.remove(); } catch (Exception) { }
        hcaptcha.render('h-captcha', { sitekey: 'c6e8ef3c-9042-49da-9f4a-31c40af222a6' })
    })
});

app.ports.save.subscribe(storage => {
    localStorage.setItem('storage', JSON.stringify(storage))
    app.ports.load.send(storage)
})

// ── Hash-anchor scrolling ────────────────────────────────────────────────────
// Elm SPA intercepts <a href="/#pricing"> and navigates without scrolling.
// This handler catches those clicks before Elm and does the right thing:
//   • Already on /  → smoothly scroll to #pricing
//   • On another page → hard-navigate so the browser loads / with the hash
document.addEventListener('click', function (e) {
    var link = e.target && e.target.closest ? e.target.closest('a') : null;
    if (!link) return;
    var href = link.getAttribute('href');
    if (href === '/#pricing' || href === '#pricing') {
        var el = document.getElementById('pricing');
        if (el) {
            e.preventDefault();
            e.stopPropagation();
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            // Not on homepage yet — let the browser navigate with hash intact
            e.preventDefault();
            e.stopPropagation();
            window.location.href = '/#pricing';
        }
    }
}, true); // capture phase so we run before Elm's listener

// After a full-page load with #pricing in URL, scroll to the section
window.addEventListener('load', function () {
    if (window.location.hash === '#pricing') {
        setTimeout(function () {
            var el = document.getElementById('pricing');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    }
});
