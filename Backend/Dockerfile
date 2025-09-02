# Start from a slim Python 3.8 base image
FROM python:3.8-slim

# Install Node.js and npm from the official repository
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /app

# --- Python Setup ---
# Copy your Python requirements file first to leverage Docker's caching
COPY requirements.txt .
# Install Python dependencies
RUN python3 -m pip install --no-cache-dir -r requirements.txt

# --- Node.js Setup ---
# Copy your package files and install npm dependencies
COPY package.json package-lock.json ./
RUN npm install

# --- Application Setup ---
# Copy the rest of your application code into the container
COPY . .

# Tell Docker that the container will listen on port 5000
EXPOSE 5000

# The command to run when the container starts
CMD ["node", "server.js"]