# Get the latest node image in which the app will run
FROM node:24

# Set the working directory inside the container
WORKDIR /app

# Copy dependency info to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the app source code to the container
COPY . .

# Build the app
RUN npm run build

# Expose the port the app will run on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]