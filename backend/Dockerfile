FROM python:3.11.4-slim-buster
ENV PYTHONUNBUFFERED 1

WORKDIR /backend

COPY requirements.txt requirements.txt

RUN pip install --upgrade pip

# Create and activate a virtual environment
RUN python -m venv /venv
ENV PATH="/venv/bin:$PATH"

RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000
RUN python manage.py collectstatic --noinput
RUN python manage.py makemigrations
RUN python manage.py migrate
CMD ["gunicorn", "bpc_compta.wsgi:application", "--bind", "0.0.0.0:8009"]
