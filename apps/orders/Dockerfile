FROM uselagoon/node-18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . . 

RUN npm run build orders

CMD ["npm", "run", "start", "orders"]