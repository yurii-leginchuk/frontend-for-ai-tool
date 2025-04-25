FROM python:3.11

ENV POETRY_VERSION=1.8.2

RUN apt-get update && apt-get install -y curl netcat-openbsd && \
    curl -sSL https://install.python-poetry.org | python3 - && \
    ln -s ~/.local/bin/poetry /usr/local/bin/poetry

WORKDIR /app

COPY pyproject.toml poetry.lock* /app/

RUN poetry config virtualenvs.create false \
 && poetry install --no-interaction --no-ansi

COPY ./app /app/app

CMD ["sh", "-c", "until nc -z -v -w30 mongo 27019; do echo 'Waiting for MongoDB...'; sleep 5; done; uvicorn app.main:app --host 0.0.0.0 --port 8000"]

