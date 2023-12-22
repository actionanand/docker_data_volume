FROM node:20.10.0

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

ARG DEFAULT_PORT=80

ENV PORT=$DEFAULT_PORT

EXPOSE $PORT
# EXPOSE ${PORT}
# EXPOSE 80

# VOLUME [ "/app/temp" ]
# add this anonymous temp through command, if you bind mount read-only 
# temp folder is inside the working dir '/app'.
# This folder (inside the container) will be mapped somewhere outside the container (in hard disk)

CMD [ "npm", "start" ]
