#
# Copyright 2021 The Kubernetes Authors
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

FROM nginx:alpine

EXPOSE 80

# RUN mkdir /etc/nginx/certificates
# COPY .keys/cert.pem /etc/nginx/certificates/cert.pem
# COPY .keys/key.pem /etc/nginx/certificates/key.pem

# default passphrase for the self-signed certificates; this Dockerfile
# is intended only for testing, do not use this for production
# RUN echo kuishell > /etc/nginx/certificates/kui.pass

#COPY conf.d /etc/nginx/conf.d
COPY . /usr/share/nginx/html
