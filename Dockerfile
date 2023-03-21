# Specify the base image
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install --production

# Copy the rest of the application files to the working directory
COPY . .

# Expose the port your application will run on
EXPOSE 5000

# Start the application
CMD [ "npm", "start" ]
