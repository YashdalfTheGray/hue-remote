FROM node:lts

ARG PORT=3308

# Try and install the latest git (ugh husky)
RUN apt-get update && apt-get install git

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app
RUN npm test

EXPOSE ${PORT}

CMD [ "npm", "start" ]
