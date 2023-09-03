const readline = require('readline')

// GET USER INPUT
async function getUserInput() {
  const obj = {}
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  async function getInput(prompt) {
    return new Promise(resolve => {
      rl.question(prompt, answer => { resolve(answer) })
    })
  }

  try {
    obj.MY_MICROSERVICE_NAME = await getInput('Enter your microservice name: ')
    obj.MY_DATABASE_NAME = await getInput('Enter your database name or leave blank to use the same name as the microservice: ') || obj.MY_MICROSERVICE_NAME
    obj.MY_SUPERUSER_NAME = await getInput('Enter your superuser name or leave blank for default (): ') || ''
    obj.MY_POSTGRES_PASS = await getInput('Enter your Postgres password or leave blank for default ()): ') || ''
    obj.MY_DATA_FOLDER_PATH = await getInput('Enter your data folder path or leave blank for default (C:\\_____\\_CODE\\databases\\test): ') || 'C:\\_____\\_CODE\\databases\\test'
  } finally {
    rl.close()
  }

  return obj
}

// CREATE TEMPLATES FOR CONFIG FILES AND MODS
async function setupConfigs(obj) {
  obj.FILE_DOCKER = `
# Use the official Node.js 20 image as a base image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port the application will run on
EXPOSE 3000

# Command to start the application
CMD [ "npm", "run", "start:prod" ]
`
  obj.FILE_DOCKER_COMPOSE = `
version: '3'
services:
  my-microservice:
    build: .
    ports:
      - '3000:3000'
      networks:
      - appnetwork
  redis:
    image: redis
    container_name: redis-container
    ports:
      - "6379:6379"
    networks:
      - appnetwork
    volumes:
      - ./config/redis.conf:/usr/local/etc/redis/redis.conf  # Mount custom config file
networks:
  appnetwork:
`
  // !! This is really bad practice, so I've set-up GutGuardian to protect this file,
  // but I wouldn't recommend this approach outside demo purposes
  obj.FILE_ENV = `
DB_HOST=localhost
DB_PORT=6379
DB_USER=${obj.MY_SUPERUSER_NAME}
DB_PASS=${obj.MY_POSTGRES_PASS}
DB_NAME=${obj.MY_MICROSERVICE_NAME}
WEATHERBIT_ISER=rc
WEATHERBIT_PASS=rc.001
WEATHERBIT_MAIL=api@rankingcoach.com
WEATHERBIT_INTERVAL=minutely
WEATHERBIT_APIKEY=b541d7219b6c468eb87fea42f3c34e9b
WEATHERBIT_URL=https://api.weatherbit.io/v2.0/
`

  return obj
}

module.exports = {
  getUserInput,
  setupConfigs
}