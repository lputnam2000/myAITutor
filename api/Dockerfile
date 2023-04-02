# Use the official Ubuntu 20.04 base image
FROM ubuntu:20.04

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Update the package list and install required packages
RUN apt-get update && apt-get install -y \
    python3.8 \
    python3-pip

# Create and set the working directory
RUN mkdir /api
WORKDIR /api

# Copy the application code and requirements.txt
COPY . /api/
COPY .env /api/.env

# Install the dependencies
RUN pip3 install --no-cache-dir -r requirements.txt

# Expose the required port for the Flask app
EXPOSE 5000

# Start the Flask app with gunicorn using 8 worker threads
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "8", "wsgi:app"]
