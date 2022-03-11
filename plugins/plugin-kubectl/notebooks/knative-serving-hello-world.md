---
title: Knative Serving - Hello World
layout:
    1: left
    default: wizard
wizard:
    steps:
        - name: Install Required Tools
          description: Install Knative Serving and the kn CLI
        - match: Hello World - Go
          name: Building your application
          description: In this example, you will build a "Hello world" application
        - name: Deploying
          description: After build is complete, push container to docker hub and then deploy your app into your cluster
        - match: Verifying
          name: Ping your Knative Service
        - match: Removing
          name: Clean Up
codeblocks:
    # Validation for Step 2: Building your application
    - match: ^git clone https://github.com/knative/docs.git knative-docs
      validation: $? -e 0 && exit 0 \|\| exit 1
    - match: ^go mod init github.com/knative/docs/code-samples/
      validation: ls go.mod
    # Validation for Step 3: Deploying your service
    - match: ^# Build the container on your local machine
      validation: $? -e 0 && exit 0 \|\| exit 1
    - match: ^kubectl apply --filename service.yaml$
      validation: kn service describe service
    - match: ^kubectl get ksvc helloworld-go  --output=custom-columns=NAME:.metadata.name,URL:.status.url$
      validation: $body
    - match: ^ NAME
      optional: true
    - match: ^kn service create helloworld-go --image=docker.io/{username}/helloworld-go --env TARGET="Go Sample v1"$
      validation: kn service describe helloworld-go
    - match: ^Creating service 'helloworld-go' in namespace 'default'
      optional: true
    # Validation for Step 4: Pinging your Knative Service
    - match: ^curl http://hello.default.127.0.0.1.sslip.io$
      validate: $body
    # Validation for Step 5: Clean Up
    - match: ^kubectl delete --filename service.yaml$
    - match : ^kn service delete helloworld-go$
    - match: ^kind delete clusters knative$
      validate: (kubectl cluster-info --context kind-knative) && exit 1 \|\| exit 0
    - match: ^minikube delete -p knative$
      validate: (kubectl cluster-info --context kind-knative) && exit 1 \|\| exit 0
---

--8<-- "https://raw.githubusercontent.com/mra-ruiz/docs/guidebooks/docs/guidebooks/knative-serving-hello-world.md"