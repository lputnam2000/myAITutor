# Use the official Python 3.8 image as a base
FROM python:3.8

# Set the working directory
WORKDIR /app

# Copy requirements.txt and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the app code into the container
COPY . .

# Expose the port the app will run on
EXPOSE 5050

# Run the command to start the app with Gunicorn
CMD ["gunicorn", "--worker-class", "eventlet", "-w", "1", "wsgi:app", "-b", "0.0.0.0:5050"]
