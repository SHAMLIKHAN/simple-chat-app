FROM node:latest
RUN mkdir -p /home/user/simple-chat-app
WORKDIR /home/user/simple-chat-app
COPY package.json /home/user/simple-chat-app
RUN npm i
COPY . /home/user/simple-chat-app
EXPOSE 3000
CMD ["npm", "start"]