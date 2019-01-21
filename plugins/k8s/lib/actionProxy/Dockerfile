FROM openwhisk/dockerskeleton

#
# fetch the kubectl binary
#
RUN curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
RUN chmod +x kubectl && mv kubectl /actionProxy

#
# add the package.json, so clients can probe e.g. version
#
ADD package.json /actionProxy/package.json

#
# the dockerskeleton dispatcher expects /action/exec for the
# entrypoint:
#
ADD kubectl.sh /action/exec
