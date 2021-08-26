FROM public.ecr.aws/bitnami/node:12.20.1 as builder
COPY package*.json  ./
RUN npm i --unsafe-perm=true
COPY . .
ARG API_BASE_URL
ARG REACT_APP_DOMAIN
ARG REACT_APP_LOGIN_URL
ARG REACT_APP_SUBDOMAIN
ARG REACT_APP_DOCUMENTS_URL



RUN npm run build-documents

FROM public.ecr.aws/nginx/nginx:1.21-alpine
ARG DRONE_TAG
COPY nginx/default.conf /etc/nginx/conf.d/
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/build/documents /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]s