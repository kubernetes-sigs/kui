FROM fholzer/nginx-brotli

RUN mkdir /etc/nginx/certificates
COPY .keys/cert.pem /etc/nginx/certificates/cert.pem
COPY .keys/key.pem /etc/nginx/certificates/key.pem

# default passphrase for the self-signed certificates; this Dockerfile
# is intended only for testing, do not use this for production
RUN echo kuishell > /etc/nginx/certificates/kui.pass

COPY conf.d /etc/nginx/conf.d
COPY build /usr/share/nginx/html
