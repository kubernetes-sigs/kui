FROM fholzer/nginx-brotli

RUN mkdir /etc/nginx/certificates
COPY .keys/ssl.crt /etc/nginx/certificates/cert.pem
COPY .keys/ssl.key /etc/nginx/certificates/key.pem

COPY conf.d /etc/nginx/conf.d
COPY build /usr/share/nginx/html
