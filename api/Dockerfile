# Use the official Ubuntu 20.04 base image
FROM python:3.8-slim-buster

WORKDIR /app

# Install R
RUN apt-get update && apt-get install -y r-base

# Copy the application code and requirements.txt

# Create the 'api' directory inside the container
RUN mkdir api

# Copy the contents of the current directory (../api/) into the 'api' directory in the container
COPY . ./api
COPY requirements.txt .

# Install the dependencies
RUN pip3 install --no-cache-dir -r requirements.txt

# Set the PYTHONPATH environment variable
ENV PYTHONPATH=/app

# Set the AWS environment variables
ENV AWS_ACCESS_KEY_ID=AKIA6NDMNPBRGSVBY4WA
ENV AWS_SECRET_ACCESS_KEY=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
ENV AWS_REGION=us-east-1

# Expose the port Gunicorn will run on
EXPOSE 5000

# Start the Flask app with gunicorn using 8 worker threads
CMD ["gunicorn", "-w", "2", "-b", "0.0.0.0:8000", "api.app:app"]