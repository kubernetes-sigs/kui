---
title: Traffic Splitting
layout:
    1: left
    default: wizard
wizard:
    description: Kubernetes-based platform to deploy and manage modern serverless workloads
    steps:
        - match: Basics of Traffic Splitting
          name: Introduction
        - Creating a new Revision
        - Splitting Traffic
        - name: Clean Up
          description: Delete your "hello" Service
codeblocks:
    - language: bash
      match: ^kn service update hello
      validate: kn revisions hello
---

--8<-- "knative-what-is-it-good-for.md"

---

# How Knative enables Powerful Traffic Splitting

---

--8<-- "https://raw.githubusercontent.com/knative/docs/main/docs/getting-started/first-traffic-split.md"
