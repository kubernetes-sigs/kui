FROM node:8.9-slim

# install debian packages
# note: git is needed by npm install in tests
RUN apt-get update \
 && apt-get install -y \
    bash git dbus dbus-x11 xvfb make g++ libnss3 libasound2 libgconf-2-4 libxtst6 libxss1 libgtk2.0-0

ADD chromedriver /chromedriver
