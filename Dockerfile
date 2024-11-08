# Use an official Node.js image as the base
FROM node:16

# Set the working directory inside the container
WORKDIR /scan_eat

# Install nvm (Node Version Manager)
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

# Source nvm and install Node.js 16
RUN /bin/bash -c "source ~/.nvm/nvm.sh && nvm install 16"

# Copy package.json and package-lock.json (if available) for dependency installation
COPY package.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm install

# Copy the source code to the working directory
COPY ./src ./

# Expose the port your app runs on
EXPOSE 8080

# Specify the command to run your app
CMD ["npm", "start"]
