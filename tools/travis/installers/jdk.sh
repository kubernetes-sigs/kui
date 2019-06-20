#!/usr/bin/env bash

echo "commencing jdk installation"

while true; do
    sudo apt install openjdk-8-jdk -y
    if [ $? != 0 ]; then
        echo "retrying jdk installation"
        sleep 5
    else
        break
    fi
done

echo "successful jdk installation"
