# 1. Use the official Node.js image as a base
FROM node:16

# 2. Set the working directory inside the container
WORKDIR /usr/src/app

# 3. Copy the package files to install dependencies
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of your project files
COPY . .

# 6. Expose the port your app runs on
EXPOSE 5001

# 7. Define the command to run your app
CMD ["npm", "start"]
