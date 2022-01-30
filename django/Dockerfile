# syntax=docker/dockerfile:1
FROM python:3
ENV PYTHONUNBUFFERED=1
WORKDIR /code
COPY code/requirements.txt /code/
RUN pip install -r requirements.txt
COPY . /code/
EXPOSE $PORT
CMD cd /code/code && python manage.py runserver 0.0.0.0:$PORT
