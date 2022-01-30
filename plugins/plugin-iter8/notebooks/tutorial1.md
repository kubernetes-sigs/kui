---
title: Iter8 &mdash; Getting Started
wizard:
    steps:
        - Introduction
        - match: 1. Install Iter8
          name: Install the CLI
          description: The iter8 CLI gives you an easy way to manage your experiments
        - match: 2. Download experiment chart
          name: Download experiment
          description: You may craft an experiment by hand, or, as we do here, you may use iter8 to download a previously constructed experiment definition
        - match: 3. Run experiment
          name: Run experiment
          description: Run load against the application, and monitor error rate and response time
        - match: 4. Assert outcomes
          name: Assert outcomes
codeblocks:
    - match: brew install iter8
      validate: iter8 -v
    - match: go install
      validate: ${GOPATH-~/go}/bin go -v
    - match: iter8 hub -e load-test
      validate: "[[ -f /tmp/load-test/values.yaml ]] && [[ -f /tmp/load-test/Chart.yaml ]] || exit 1"
    - match: iter8 run
      validate: "[[ -f /tmp/load-test/experiment/values.yaml ]] || exit 1"
---

# Iter8: Kubernetes Release Engineering

[Iter8](https://iter8.tools) is the **release engineering** platform
for Kubernetes applications and ML models.

Iter8 is designed for DevOps and MLOps teams interested in maximizing
release velocity and business value with their apps/ML models while
protecting end-user experience. Use Iter8 for SLO validation, A/B
testing and progressive rollouts of K8s apps/ML models.

## Introduction

This tutorial uses an [Iter8 experiment](concepts.md#what-is-an-iter8-experiment) to load test https://example.com and validate latency and error-related service level objectives (SLOs).

> ### What is an Iter8 experiment?
>
> An Iter8 experiment is a sequence of tasks that produce metrics-driven insights for your app/ML model versions, validates them, and optionally performs a rollout. Iter8 provides a set of pre-defined and customizable tasks.

--8<-- "https://raw.githubusercontent.com/iter8-tools/iter8/master/mkdocs/docs/getting-started/your-first-experiment.md"
