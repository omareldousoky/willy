FROM node:10-alpine as builder
COPY package*.json  ./
RUN npm i 
COPY . .
RUN npm run build-mohassel

FROM nginx:1.14.1-alpine
ARG DRONE_TAG
COPY nginx/default.conf /etc/nginx/conf.d/
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /build/mohassel /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
