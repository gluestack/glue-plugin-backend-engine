FROM node:latest

# Install your app
WORKDIR /server

# Install npm
# RUN apt-get update && apt-get install -y npm

COPY package*.json ./
RUN ["npm", "install"]
COPY . .
EXPOSE 9000

RUN ["npm", "install", "nodemon"]

# Run the app
CMD ["npm", "run", "start:server"]


# done
