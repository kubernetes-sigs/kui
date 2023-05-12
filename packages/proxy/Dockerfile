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

FROM node:12-bullseye-slim

## preesed tzdata, update package index, upgrade packages and install needed software
ENV DEBIAN_FRONTEND=noninteractive
ENV DEBCONF_NONINTERACTIVE_SEEN=true
COPY preseed.txt /tmp/preseed.txt

# proxy ports (keep in sync with conf.d/proxy.conf)
ENV KUI_PROXY_PORT 3000
ENV KUI_PROXY_EXTERNAL_PORT 9080
ENV HOME /home/kui

# for development, we inject the developer's kubeconfig into the container
ARG KUBECONFIG
ENV KUBECONFIG=$KUBECONFIG

# build-time injection of ContentSecurityPolicy
ARG CSP
ENV CSP=$CSP

# build-time injection of OpenGraph headers
ARG OPENGRAPH
ENV OPENGRAPH=$OPENGRAPH

###########
# Note: Latest version of kubectl may be found at:
# https://aur.archlinux.org/packages/kubectl-bin/
ARG KUBE_VERSION
ENV KUBE_VERSION=$KUBE_VERSION
ARG HELM_VERSION
ENV HELM_VERSION=$HELM_VERSION
ARG OC_VERSION
ENV OC_VERSION=$OC_VERSION
ENV KUI_HELM_CLIENTS_DIR=/usr/local/bin
# Note: Latest version of helm may be found at:
# https://github.com/kubernetes/helm/releases

ARG NODE_PTY_VERSION
ENV NODE_PTY_VERSION=$NODE_PTY_VERSION

# nginx port
EXPOSE 80/tcp

RUN mkdir /kui-proxy

RUN mkdir -p /usr/share/nginx
COPY . /usr/share/nginx/html

# copy in our nginx configs
COPY conf.d/default.conf /tmp/default-template.conf

# build-essential and python are needed by the "npty" line, to rebuild
# the node-pty binaries

RUN debconf-set-selections /tmp/preseed.txt && \
    rm -f /etc/timezone /etc/localtime && \
    apt update && apt install -y --no-install-recommends build-essential python sed git tzdata nginx ca-certificates bash git python build-essential curl upx gettext-base unzip && \
    cd /usr/share/nginx/html/kui && npm link ./app --no-package-lock && \
    (cd /tmp && mkdir npty && cd npty && npm init -y && npm install node-pty@$NODE_PTY_VERSION && cd /usr/share/nginx/html/kui/dist/headless && cp /tmp/npty/node_modules/node-pty/build/Release/pty.node . && cp pty.node pty-proxy.node && mkdir -p ../build/Release && cp /tmp/npty/node_modules/node-pty/build/Release/spawn-helper ../build/Release) && \
    curl -LO https://dl.k8s.io/release/v${KUBE_VERSION}/bin/linux/amd64/kubectl && chmod +x kubectl && mv kubectl /usr/local/bin/kubectl && upx /usr/local/bin/kubectl && \
    curl -L https://get.helm.sh/helm-v${HELM_VERSION}-linux-amd64.tar.gz | tar zxf - && mv linux-amd64/helm /usr/local/bin/helm && chmod +x /usr/local/bin/helm && upx /usr/local/bin/helm && rm -rf linux-amd64 && \
    curl -L https://mirror.openshift.com/pub/openshift-v4/clients/ocp/${OC_VERSION}/openshift-client-linux.tar.gz | tar zxf - && \
      mv oc /usr/local/bin && \
      chmod +x /usr/local/bin/oc && upx /usr/local/bin/oc && \
    curl -LO https://mirror.openshift.com/pub/openshift-v4/clients/odo/latest/odo-linux-amd64 \
      && mv odo-linux-amd64 /usr/local/bin/odo && chmod +x /usr/local/bin/odo && upx /usr/local/bin/odo && \
    curl -L https://download.clis.cloud.ibm.com/ibm-cloud-cli/1.6.0/IBM_Cloud_CLI_1.6.0_amd64.tar.gz | tar zxf - \
        && mv Bluemix_CLI/bin/ibmcloud /usr/local/bin \
        && chmod a+rX /usr/local/bin/ibmcloud && upx /usr/local/bin/ibmcloud && rm -rf Bluemix_CLI && \
    curl -LO https://github.com/kalantar/etc3/raw/linux-x64/linux-x64/iter8ctl \
        && chmod +x iter8ctl && upx iter8ctl && mv iter8ctl /usr/local/bin && \
    envsubst '${CSP},${OPENGRAPH}' < /tmp/default-template.conf > /etc/nginx/conf.d/default.conf && \
    apt remove -y perl python make g++ upx gettext-base && apt -y auto-remove && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /home/kui/.cache/node-gyp && \
    rm -f /usr/share/nginx/html/kui/kubectl && \
    rm /etc/nginx/sites-enabled/default \
        && ln -sf /dev/stdout /var/log/nginx/access.log \
        && ln -sf /dev/stderr /var/log/nginx/error.log

# resmash in our index.html
COPY index.html /usr/share/nginx/html/index.html

# profile.d
# COPY profile.d /tmp/profile.d
# RUN for i in /tmp/profile.d/*; do cat $i >> /etc/profile; done

# kubeconfig
COPY .kube /root/.kube
COPY .bluemix /root/.bluemix

# krew
#RUN set -x; cd "$(mktemp -d)" && \
#  curl -fsSLO "https://github.com/kubernetes-sigs/krew/releases/latest/download/krew.{tar.gz,yaml}" && \
#  tar zxvf krew.tar.gz && \
#  KREW=./krew-"$(uname | tr '[:upper:]' '[:lower:]')_amd64" && \
#  "$KREW" install --manifest=krew.yaml --archive=krew.tar.gz && \
#  "$KREW" update
#ENV PATH=/root/.krew/bin:$PATH

# issues with running in e.g. knative
RUN mkdir -p /home/kui \
        && chown -R www-data:www-data /home/kui \
        && chown -R www-data:www-data /var/lib/nginx \
        && touch /run/nginx.pid \
        && chown -R www-data:www-data /run/nginx.pid

CMD [ "/usr/share/nginx/html/start-proxy-and-nginx.sh" ]
