# syntax=docker/dockerfile:1

FROM python:3.11-alpine

WORKDIR /app

RUN apk update \
	&& apk add --virtual build-depts gcc python3-dev musl-dev \
	&& apk add --no-cache mariadb-dev

RUN pip install awscli

COPY . .

RUN pip3 install -r requirements.txt

RUN apk del build-depts

EXPOSE 5000

ENTRYPOINT ["gunicorn", "--config", "gunicorn_config.py", "--chdir", "src", "server:app"]
