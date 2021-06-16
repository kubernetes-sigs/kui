#
# Copyright 2019 The Kubernetes Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

FROM node:12-buster-slim

## preesed tzdata, update package index, upgrade packages and install needed software
COPY preseed.txt /tmp/preseed.txt
RUN debconf-set-selections /tmp/preseed.txt && \
    rm -f /etc/timezone /etc/localtime && \
    apt-get update && \
    apt-get install -y tzdata
RUN rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# proxy ports (keep in sync with conf.d/proxy.conf)
ENV PORT 3000
ENV KUI_PROXY_EXTERNAL_PORT 9080

# nginx port
EXPOSE 80/tcp

RUN apt update
RUN apt install -y nginx
RUN rm /etc/nginx/sites-enabled/default \
        && ln -sf /dev/stdout /var/log/nginx/access.log \
        && ln -sf /dev/stderr /var/log/nginx/error.log

# for development, we inject the developer's kubeconfig into the container
ARG KUBECONFIG
ENV KUBECONFIG=$KUBECONFIG

# the following from https://github.com/dtzar/helm-kubectl/blob/2.12.2/Dockerfile
###########
# Note: Latest version of kubectl may be found at:
# https://aur.archlinux.org/packages/kubectl-bin/
ARG KUBE_VERSION
ENV KUBE_VERSION=$KUBE_VERSION
ARG HELM_VERSION
ENV HELM_VERSION=$HELM_VERSION
ARG OC_VERSION
ENV OC_VERSION=$OC_VERSION
# Note: Latest version of helm may be found at:
# https://github.com/kubernetes/helm/releases

# we will download a gamut of helm clients and place them here
# @see plugins/plugin-k8s/src/lib/util/discovery/helm-client.ts
#
# Note that HELM_LATEST_VERSION does not mean which version we will
# present to the user; rather, we just need at least one working
# version in order to determine what version actually to use, for the
# user (based on `helm --short --server version`)
ENV KUI_HELM_CLIENTS_DIR=/usr/local/bin

RUN (apt install -y ca-certificates bash git python build-essential wget curl && wget -q https://storage.googleapis.com/kubernetes-release/release/v${KUBE_VERSION}/bin/linux/amd64/kubectl -O /usr/local/bin/kubectl && chmod +x /usr/local/bin/kubectl) && \
      wget -q https://get.helm.sh/helm-v${HELM_VERSION}-linux-amd64.tar.gz -O - | tar zxf - && cp linux-amd64/helm /usr/local/bin/helm && chmod +x /usr/local/bin/helm
###########

#### OPENSHIFT tools
RUN wget -q https://mirror.openshift.com/pub/openshift-v4/clients/ocp/${OC_VERSION}/openshift-client-linux.tar.gz -O - | tar zxf - && \
      cp oc /usr/local/bin && \
      chmod +x /usr/local/bin/oc
RUN wget -q https://mirror.openshift.com/pub/openshift-v4/clients/odo/latest/odo-linux-amd64 -O /usr/local/bin/odo && \
      chmod +x /usr/local/bin/odo

COPY conf.d/default.conf /etc/nginx/conf.d/default.conf

RUN mkdir /kui-proxy

COPY . /usr/share/nginx/html

RUN cd /usr/share/nginx/html/kui && npm link ./app --no-package-lock

# recompile pty
RUN cd /usr/share/nginx/html/kui/node_modules/node-pty && npm run install

# kubeconfig
COPY .kube /root/.kube
COPY .bluemix /root/.bluemix

# krew
RUN set -x; cd "$(mktemp -d)" && \
  curl -fsSLO "https://github.com/kubernetes-sigs/krew/releases/latest/download/krew.{tar.gz,yaml}" && \
  tar zxvf krew.tar.gz && \
  KREW=./krew-"$(uname | tr '[:upper:]' '[:lower:]')_amd64" && \
  "$KREW" install --manifest=krew.yaml --archive=krew.tar.gz && \
  "$KREW" update
ENV PATH=/root/.krew/bin:$PATH

# profile.d
COPY profile.d /tmp/profile.d
RUN for i in /tmp/profile.d/*; do cat $i >> /etc/profile; done

RUN apt remove -y curl wget python make g++ && apt -y auto-remove

CMD [ "/usr/share/nginx/html/start-proxy-and-nginx.sh" ]
