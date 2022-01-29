---
title: Knative &mdash; Getting Started
wizard:
    steps:
        - Before you begin
        - name: Prepare local Kubernetes cluster
          description: Using kind or minikube can help you isolate your Knative learning experiments.
        - Install the Kubernetes CLI
        - Install the Knative CLI
        - name: Install the Knative "Quickstart" environment
          description: The kn quickstart plugin can quickly set up Knative against kind of minikube
codeblocks:
    - language: bash
      match: ^brew install kn$
      validate: brew info kn
---

<!-- This is a demonstration of including unmodified markdown content, and overlaying a wizard -->

--8<-- "https://raw.githubusercontent.com/knative/docs/main/docs/getting-started/README.md"
