FROM node:20.10.0

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 80

# VOLUME [ "/app/feedback" ]
# feedback folder is inside the working dir '/app'.
# This folder (inside the container) will be mapped somewhere outside the container (in hard disk)

CMD [ "node", "server.js" ]
