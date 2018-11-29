FROM shell-test-base

WORKDIR /tests

# auth keys
ADD .openwhisk-shell /.openwhisk-shell

ADD dist /dist
ADD app /app
ADD tests /tests

CMD ./bin/runWithXvfb.sh
