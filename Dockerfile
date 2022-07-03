FROM node:18-alpine3.14

#ENV USERNAME=GP \
#    DB_PWD=Oo123456

RUN mkdir -p /home/app

COPY ./app /home/app

# set default dir so that next commands executes in /home/app dir
WORKDIR /home/app

# will execute npm install in /home/app because of WORKDIR
RUN npm install

# no need for /home/app/server.js because of WORKDIR
CMD ["node", "index.js"]

