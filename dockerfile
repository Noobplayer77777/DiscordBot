FROM node:latest

WORKDIR /src

COPY  package*.json ./

RUN npm install

COPY . .

ENV Mongo=mongodb+srv://northernstarmusic:DSu87GEKucXgtORa@cluster0.6egjg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
ENV TOKEN=OTMwODA4NjU4NDEyMDcyOTkw.Yd7RHQ.5t7a6GCtY5ktIQ6FmXDPKibVEQE
ENV host=node2.yungcz.com
ENV password=youshallnotpass

CMD [ "npm", "run", "main" ]