---
title: Knative Quickstart
layout:
    1: left
    default: wizard
wizard:
    steps:
        - match: Install Knative using quickstart
          name: Install required tools
        - match: Install the Knative quickstart plugin
          name: Install and use the Knative quickstart plugin
          description: The plugin sets up Knative against kind by creating a kind cluster populated with Knative
        - match: Deploying your first Knative Service
          name: Example 1 - Deploying your first Knative Service
          description: In this example, you will deploy a "Hello world" service
        - name: Clean Up
codeblocks:
    - match: ^brew install kn$
      validate: kn version
    - match: ^brew upgrade kn$
      optional: true
    - match: ^brew tap --repair
      optional: true
    - match: ^mv kn /usr/local/bin$
      validate: kn version
    - match: ^kn version$
      validate: $body
    - match: ^brew install knative-sandbox/kn-plugins/quickstart$
      validate: kn quickstart --help
    - match: ^brew upgrade knative-sandbox/kn-plugins/quickstart$
      optional: true
    - match: ^kn quickstart --help$
      validate: $body
    - match: ^mv kn-quickstart /usr/local/bin$
      validate: kn quickstart --help
    - match: ^kn quickstart kind$
      validate: (kubectl cluster-info --context kind-knative) && exit 0 || exit 1
    - match: ^kn quickstart minikube$
      validate: minikube profile list
    - match: ^kn service create hello
      validate: kn service describe hello
    - match: ^kubectl apply -f hello.yaml$
      validate: kn service describe hello
    - match: ^curl http://hello.default.127.0.0.1.sslip.io$
      validate: $body
    - match: ^[Resolve]
      optional: true
    - match: ^kind delete clusters knative$
      validate: (kubectl cluster-info --context kind-knative) && exit 1 || exit 0
    - match: ^minikube delete -p knative$
      validate: (kubectl cluster-info --context kind-knative) && exit 1 || exit 0
---

--8<-- "https://raw.githubusercontent.com/kubernetes-sigs/kui/master/plugins/plugin-kubectl/notebooks/knative-what-is-it-good-for.md"

---

--8<-- "https://raw.githubusercontent.com/mra-ruiz/docs/guidebooks/docs/getting-started/README.md"

---

--8<-- "https://raw.githubusercontent.com/mra-ruiz/docs/guidebooks/docs/getting-started/quickstart-install.md"

--8<-- "https://raw.githubusercontent.com/mra-ruiz/docs/guidebooks/docs/getting-started/first-service.md"

--8<-- "https://raw.githubusercontent.com/mra-ruiz/docs/guidebooks/docs/getting-started/clean-up.md"