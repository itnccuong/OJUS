# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

#Clear npm cache and remove previous node_modules

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Update package lists
RUN apt-get update

# Install certificates, curl, and gnupg
RUN apt-get install -y \
    ca-certificates \
    curl \
    gnupg

# Create a directory for the Docker keyrings
RUN install -m 0755 -d /etc/apt/keyrings

# Add Docker's official GPG key for Debian
RUN curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Adjust permissions for the key
RUN chmod a+r /etc/apt/keyrings/docker.gpg

# Add Docker's repository for Debian
RUN echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
    tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update package lists again to include Docker's repository
RUN apt-get update

# Install Docker components
RUN apt-get install -y \
    docker-ce \
    docker-ce-cli \
    containerd.io \
    docker-buildx-plugin \
    docker-compose-plugin

# Clean up to reduce image size
RUN rm -rf /var/lib/apt/lists/*

# Expose the port your application will run on
EXPOSE 8080

# Set the command to start your application
CMD ["npm", "start"]