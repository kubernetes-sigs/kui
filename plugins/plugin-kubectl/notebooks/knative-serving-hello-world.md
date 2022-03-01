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
        - match: Deploying
          name: Deploying your service
          description: After build is complete, push container to docker hub and then deploy your app into your cluster
        - match: Verifying
          name: Ping your Knative Service
        - match: Removing
          name: Clean Up
codeblocks:
    # Validation for Knative CLI under step 1 Required Tools
    - match: ^(kn version >& /dev/null) && echo "You have the Knative CLI" \|\| (echo "Please install the Knative CLI" && exit 1)$
      validate: $body
    - match: ^brew install kn$
      validate: kn version
    - match: ^brew upgrade kn$
      optional: true
    - match: ^mv <path-to-binary-file> kn
      validate: kn version
    - match: ^mv kn /usr/local/bin$
      validate: kn version
    - match: ^git clone https://github.com/knative/client.git
      validate: $? -e 0 && exit 0 \|\| exit 1
    - match: ^hack/build.sh -f$
      validate: $? -e 0 && exit 0 \|\| exit 1
    - match: ^kn version$
      validate: $body
    - match: ^docker run --rm -v "$HOME/.kube/config:/root/.kube/config" gcr.io/knative-releases/knative.dev/client/cmd/kn:latest service list$
      validate: $? -e 0 && exit 0 \|\| exit 1
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

--8<-- "https://raw.githubusercontent.com/kubernetes-sigs/kui/master/plugins/plugin-kubectl/notebooks/knative-what-is-it-good-for.md"

---

# Knative Serving - Deploying "Hello World"

This application will be deplyoyed as a Knative Service instead of a Kubernetes service.

---

# Install Required Tools

!!! note "Note - Installing Knative" 
    If you install Knative using Quickstart, when you run the quickstart plugin, a cluster called `knative` will be created. To complete the deployment of the "Hello World" application, a pre-built app with a container already pushed to Docker hub will be used.

--8<-- "knative.md"

--8<-- "kn-cli.md"

--8<-- "https://raw.githubusercontent.com/mra-ruiz/docs/guidebooks/code-samples/serving/hello-world/helloworld-go/README.md"

--8<-- "https://raw.githubusercontent.com/mra-ruiz/docs/guidebooks/docs/getting-started/clean-up.md"