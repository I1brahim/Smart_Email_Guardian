# Use official Python base image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy app files
COPY app.py history.json history_manager.py requirements.txt ./

# Copy models
COPY models/ ./models/

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose Flask port
EXPOSE 5000

# Run the app
CMD ["python", "app.py"]
