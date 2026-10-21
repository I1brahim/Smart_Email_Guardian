FROM python:3.13-slim
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py inference.py ./
COPY models/ ./models/
RUN useradd --system --uid 10001 guardian
USER guardian
ENV PORT=5000
EXPOSE 5000
CMD ["sh", "-c", "exec gunicorn --bind 0.0.0.0:${PORT:-5000} --workers 2 --threads 2 --timeout 60 app:app"]
