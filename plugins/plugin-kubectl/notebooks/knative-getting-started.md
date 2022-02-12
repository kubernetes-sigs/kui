---
title: Knative &mdash; Getting Started
layout:
    1: left
    default: wizard
wizard:
    steps:
        - match: Install Knative using quickstart
          name: Introduction
        - Before you begin
        - name: Prepare local Kubernetes cluster
          description: Using kind or minikube can help you isolate your Knative learning experiments.
        - Install the Knative CLI
        - name: Install the Knative quickstart plugin
          description: This gives you a kn quickstart command
        - name: Run the Knative quickstart plugin
          description: This will quickly set up Knative against kind or minikube
        - Next steps
codeblocks:
    - match: ^brew install kn$
      validate: brew info kn
    - match: ^brew install knative-sandbox/kn-plugins/quickstart$
      validate: kn quickstart --help
    - match: brew upgrade
      optional: true
    - match: kn quickstart --help
      optional: true
---

--8<-- "knative-what-is-it-good-for.md"

---

# Getting started with Knative

This guidebook helps you install Knative on a `kind` or `minikube` cluster.

---

--8<-- "https://raw.githubusercontent.com/knative/docs/main/docs/getting-started/quickstart-install.md"

<!-- This is a demonstration of including unmodified markdown content, and overlaying a wizard -->
