#!/usr/bin/env bash

echo "Installing ibmcloud CLI"
n=0
until [ $n -ge 20 ]; do
    curl -L https://clis.ng.bluemix.net/install/${TRAVIS_OS_NAME} | bash - && break
    n=$[$n+1]
    sleep 2
done

if [ -z "${LOCAL_OPENWHISK}" ]; then
    echo "Acquiring OpenWhisk auth"
    n=0
    until [ $n -ge 20 ]; do
        ibmcloud login -a "$IBMCLOUD_API_ENDPOINT" -o "$TEST_ORG" -s "$TEST_SPACE_PREFIX1" --apikey "$IAM_KEY" && break
        n=$[$n+1]
        sleep 2
    done

    echo "Installing cloud-functions ibmcloud plugin"
    n=0
    until [ $n -ge 20 ]; do
        ibmcloud plugin install cloud-functions && break
        n=$[$n+1]
        sleep 2
    done
fi
