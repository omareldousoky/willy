FROM node:12.16.1-alpine as builder
RUN echo -e "https://dl-cdn.alpinelinux.org/alpine/v3.11/main\nhttps://dl-cdn.alpinelinux.org/alpine/v3.11/community" > /etc/apk/repositories
RUN apk add --no-cache git
COPY package*.json  ./
RUN npm i
COPY . .
ARG API_BASE_URL
ARG REACT_APP_URL
ARG REACT_APP_LOGIN_URL
ARG REACT_APP_GOOGLE_MAP_KEY
ARG REACT_APP_DOMAIN
ARG REACT_APP_SUBDOMAIN
RUN npm run build-mohassel

FROM nginx:1.14.1-alpine
ARG DRONE_TAG
COPY nginx/default.conf /etc/nginx/conf.d/
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /build/cf /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
