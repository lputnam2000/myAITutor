# Use the official Ubuntu 20.04 base image
FROM python:3.8-slim-buster

WORKDIR /app

# Install R
RUN apt-get update && apt-get install -y r-base

# Copy the application code and requirements.txt


COPY requirements.txt .
COPY credentials ./credentials

# Install the dependencies
RUN pip3 install --no-cache-dir -r requirements.txt

# Set the PYTHONPATH environment variable
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=TRUE
RUN python -m nltk.downloader punkt

# Set the AWS environment variables
RUN mkdir -p /root/.aws && cp ./credentials /root/.aws/credentials

# Create the 'api' directory inside the container
RUN mkdir api

# Copy the contents of the current directory (../api/) into the 'api' directory in the container
COPY . ./api

# Expose the port Gunicorn will run on
EXPOSE 8000

# Start the Flask app with gunicorn using 8 worker threads
CMD ["gunicorn", "-w", "2", "-b", "0.0.0.0:8000", "api.app:app"]