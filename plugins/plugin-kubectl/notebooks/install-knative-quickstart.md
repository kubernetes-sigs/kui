---
title: Install Knative - Quickstart
layout:
    1: left
    default: wizard
wizard:
    steps:
        - name: Install required tools
        - name: Install the Knative quickstart plugin
          description: The plugin sets up Knative against kind by creating a kind cluster populated with Knative
        - Run the Knative quickstart plugin
        - Clean Up
codeblocks:
    # validation for step 2: install the knative quickstart plugin
    - match: ^brew install knative-sandbox/kn-plugins/quickstart$
      validate: kn quickstart --help
    - match: ^brew upgrade knative-sandbox/kn-plugins/quickstart$
      optional: true
    - match: ^kn quickstart --help$
      validate: $body
    - match: ^git clone https://github.com/knative-sandbox/kn-plugin-quickstart.git
      validate: $? -e 0 && exit 0 || exit 1
    - match: ^hack/build.sh$
      validate: $? -e 0 && exit 0 || exit 1
    - match: ^mv kn-quickstart /usr/local/bin$
      validate: kn quickstart --help
    # validation for step 3: Run the knative quickstart plugin
    - match: ^kn quickstart kind$
      validate: (kubectl cluster-info --context kind-knative) && exit 0 || exit 1
    - match: ^kn quickstart minikube$
      validate: minikube profile list
    - match: ^minikube tunnel --profile knative$
      validate: $? -e 0 && exit 0 || exit 1
    # Validation for Step 4: Clean Up
    - match: ^kubectl delete --filename service.yaml$
    - match : ^kn service delete helloworld-go$
    - match: ^kind delete clusters knative$
      validate: (kubectl cluster-info --context kind-knative) && exit 1 \|\| exit 0
    - match: ^minikube delete -p knative$
      validate: (kubectl cluster-info --context kind-knative) && exit 1 \|\| exit 0
---

--8<-- "https://raw.githubusercontent.com/mra-ruiz/docs/guidebooks/docs/guidebooks/install-knative-quickstart.md"