FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install
RUN npm install nodemon -g

# Bundle app source
COPY . .

# Expose port
EXPOSE 3000

# Start with nodemon
CMD ["npm", "run", "dev"]
