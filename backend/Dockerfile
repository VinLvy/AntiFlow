# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Install uvicorn authentication for production
RUN pip install uvicorn

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Define environment variable
ENV NAME World

# Run app.py when the container launches
# Cloud Run injects the PORT environment variable, uvicorn needs to listen on 0.0.0.0
CMD exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080}