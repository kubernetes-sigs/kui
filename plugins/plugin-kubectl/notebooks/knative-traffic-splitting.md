---
title: Traffic Splitting
wizard:
    description: Kubernetes-based platform to deploy and manage modern serverless workloads
    steps:
        - Basics of Traffic Splitting
        - Creating a new Revision
        - Splitting Traffic
        - name: Clean Up
          description: Delete your "hello" Service
codeblocks:
    - language: bash
      match: ^kn service update hello
      validate: kn revisions hello
---
Traffic Splitting
---

--8<-- "https://raw.githubusercontent.com/knative/docs/main/docs/getting-started/first-traffic-split.md"