FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app/api

RUN pip install --no-cache-dir --upgrade pip

COPY api/pyproject.toml ./
RUN pip install --no-cache-dir ".[dev]"

COPY api .
COPY shared /app/shared

EXPOSE 3000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3000", "--reload"]
