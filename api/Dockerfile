FROM python:3.8-slim-buster

ENV PYTHONUNBUFFERED 1

RUN pip install --upgrade pip

COPY ./api/requirements.txt /tmp/requirements.txt
COPY ./api /api
WORKDIR /api
EXPOSE 8000

RUN python -m venv /py && \
    /py/bin/pip install --upgrade pip && \
    /py/bin/pip install -r /tmp/requirements.txt && \
    rm -rf /tmp && \
    adduser \
        --disabled-password \
        --no-create-home \
        django-user

ENV PATH="/py/bin:$PATH"

ENTRYPOINT ["python", "manage.py"]
CMD ["runserver", "0.0.0.0:8000"]
USER django-user