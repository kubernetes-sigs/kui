#
# Copyright 2019-20 The Kubernetes Authors
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

FROM mhart/alpine-node:12

# proxy ports (keep in sync with conf.d/proxy.conf)
ENV PORT 3000
ENV KUI_PROXY_EXTERNAL_PORT 9080

# nginx port
EXPOSE 80/tcp

RUN apk add --no-cache nginx
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
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
ENV HELM_LATEST_VERSION="${KUI_HELM_CLIENTS_DIR}"/helm-2.14

RUN (apk add --no-cache ca-certificates bash git python make g++ && wget -q https://storage.googleapis.com/kubernetes-release/release/${KUBE_VERSION}/bin/linux/amd64/kubectl -O /usr/local/bin/kubectl && chmod +x /usr/local/bin/kubectl) & \
    (wget -q https://storage.googleapis.com/kubernetes-helm/helm-v2.9.0-linux-amd64.tar.gz -O - | tar -xzO linux-amd64/helm > /usr/local/bin/helm-2.9 && chmod +x /usr/local/bin/helm-2.9) & \
    (wget -q https://storage.googleapis.com/kubernetes-helm/helm-v2.10.0-linux-amd64.tar.gz -O - | tar -xzO linux-amd64/helm > /usr/local/bin/helm-2.10 && chmod +x /usr/local/bin/helm-2.10) & \
    (wget -q https://storage.googleapis.com/kubernetes-helm/helm-v2.11.0-linux-amd64.tar.gz -O - | tar -xzO linux-amd64/helm > /usr/local/bin/helm-2.11 && chmod +x /usr/local/bin/helm-2.11) & \
    (wget -q https://storage.googleapis.com/kubernetes-helm/helm-v2.12.2-linux-amd64.tar.gz -O - | tar -xzO linux-amd64/helm > /usr/local/bin/helm-2.12 && chmod +x /usr/local/bin/helm-2.12) & \
    (wget -q https://storage.googleapis.com/kubernetes-helm/helm-v2.13.1-linux-amd64.tar.gz -O - | tar -xzO linux-amd64/helm > /usr/local/bin/helm-2.13 && chmod +x /usr/local/bin/helm-2.13) & \
    (wget -q https://storage.googleapis.com/kubernetes-helm/helm-v2.14.1-linux-amd64.tar.gz -O - | tar -xzO linux-amd64/helm > /usr/local/bin/helm-2.14 && chmod +x /usr/local/bin/helm-2.14); wait
###########

COPY conf.d/default.conf /etc/nginx/conf.d/default.conf

RUN mkdir /kui-proxy

COPY . /usr/share/nginx/html

RUN cd /usr/share/nginx/html/kui && npm link ./app --no-package-lock

# recompile pty
RUN cd /usr/share/nginx/html/kui/node_modules/node-pty-prebuilt-multiarch && npm run install && apk del python make g++

# kubeconfig
COPY .kube /root/.kube

# krew
RUN apk add --no-cache curl && \
  set -x; cd "$(mktemp -d)" && \
  curl -fsSLO "https://github.com/kubernetes-sigs/krew/releases/latest/download/krew.{tar.gz,yaml}" && \
  tar zxvf krew.tar.gz && \
  KREW=./krew-"$(uname | tr '[:upper:]' '[:lower:]')_amd64" && \
  "$KREW" install --manifest=krew.yaml --archive=krew.tar.gz && \
  "$KREW" update && \
   apk del curl
ENV PATH=/root/.krew/bin:$PATH

# profile.d
COPY profile.d /tmp/profile.d
RUN for i in /tmp/profile.d/*; do cat $i >> /etc/profile; done

CMD [ "/usr/share/nginx/html/start-proxy-and-nginx.sh" ]
