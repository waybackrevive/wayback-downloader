# syntax=docker/dockerfile:1

FROM python:3.11-bookworm

WORKDIR /app

RUN apt-get update && apt-get install default-libmysqlclient-dev build-essential ruby-full -y
RUN pip install awscli
RUN gem install wayback_machine_downloader

COPY . .

RUN pip3 install -r requirements.txt

CMD ["python", "-m", "src.main"]
