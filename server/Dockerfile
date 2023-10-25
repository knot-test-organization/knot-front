# Use the official Node.js image as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY ./package.json ./
COPY ./package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire app directory to the container
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the Express server
CMD ["npm", "start"]
