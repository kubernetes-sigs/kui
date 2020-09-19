FROM node:lts-alpine3.12

RUN npm init -y
RUN npm install --no-save --no-package-lock minio

ADD dist/vfs/parallel/ /parallel

CMD ["/parallel/main"]
