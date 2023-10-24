FROM uselagoon/node-18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . . 

RUN npm run build authorization

CMD ["npm", "run", "start", "authorization"]