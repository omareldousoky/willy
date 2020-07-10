From node:12.16.1-alpine
RUN apk add git
Copy . . 
RUN npm i
RUN npm run build 
