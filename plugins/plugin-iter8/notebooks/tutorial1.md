---
title: Iter8 &mdash; Getting Started
layout: wizard
---

# Iter8: Kubernetes Release Engineering

[Iter8](https://iter8.tools) is the **release engineering** platform
for Kubernetes applications and ML models.

Iter8 is designed for DevOps and MLOps teams interested in maximizing
release velocity and business value with their apps/ML models while
protecting end-user experience. Use Iter8 for SLO validation, A/B
testing and progressive rollouts of K8s apps/ML models.

---

## Introduction

This tutorial uses an [Iter8 experiment](concepts.md#what-is-an-iter8-experiment) to load test https://example.com and validate latency and error-related service level objectives (SLOs).

> ### What is an Iter8 experiment?
>
> An Iter8 experiment is a sequence of tasks that produce metrics-driven insights for your app/ML model versions, validates them, and optionally performs a rollout. Iter8 provides a set of pre-defined and customizable tasks.

---

## Install the CLI: The iter8 CLI gives you an easy way to manage your experiments

=== "Mac"

    On macOS, [Homebrew](https://brew.sh) makes it easy to install the `iter8` CLI.

    ```shell
    ---
    id: install-iter8-cli
    validate: brew info iter8
    ---
    brew tap iter8-tools/iter8
    brew install iter8
    ```
    
=== "Go 1.16+"
    Install Iter8 using [Go 1.16+](https://golang.org/) as follows.

    ```shell
    ---
    id: install-iter8-cli
    before: export PATH=~/${GOPATH-~/go}/bin:$PATH
    validate: iter8 -v
    ---
    go install github.com/iter8-tools/iter8@latest
    ```

=== "Binaries"
    Pre-compiled Iter8 binaries for many platforms are available [here](https://github.com/iter8-tools/iter8/releases). Uncompress the iter8-X-Y.tar.gz archive for your platform, and move the iter8 binary to any folder in your PATH.

---

## Download experiment: You may craft an experiment by hand, or, as we do here, you may use iter8 to download a previously constructed experiment definition

Download the `load-test` experiment folder from [Iter8 hub](../user-guide/topics/iter8hub.md) as follows.

```shell
---
id: download-load-test
validate: "[[ -f /tmp/load-test/values.yaml ]] && [[ -f /tmp/load-test/Chart.yaml ]] || exit 1"
status: done
---
cd /tmp && iter8 hub -e load-test
```

---

## Run experiment: Run load against the application, and monitor error rate and response time

[Iter8 experiments](concepts.md#what-is-an-iter8-experiment) are specified using the `experiment.yaml` file. The `iter8 run` command reads this file, runs the specified experiment, and writes the results of the experiment into the `result.yaml` file.

Run the experiment you downloaded above as follows.

```shell
---
id: run-experiment
validate: "[[ -f /tmp/load-test/experiment/values.yaml ]] || exit 1"
---
cd /tmp/load-test && iter8 run --set url=https://example.com
```

??? note "Look inside experiment.yaml"

    This experiment contains the [`gen-load-and-collect-metrics` task](../user-guide/tasks/collect.md) for generating load and collecting metrics, and the [`assess-app-versions` task](../user-guide/tasks/assess.md) for validating SLOs.

    ```yaml
    # task 1: generate HTTP requests for https://example.com and
    # collect Iter8's built-in latency and error-related metrics
    - task: gen-load-and-collect-metrics
      with:
        versionInfo:
        - url: https://example.com
    # task 2: validate if the app (hosted at https://example.com) satisfies 
    # service level objectives (SLOs)
    # this task uses the built-in metrics collected by task 1 for validation
    - task: assess-app-versions
      with:
        SLOs:
          # error rate must be 0
        - metric: built-in/error-rate
          upperLimit: 0
          # 95th percentile latency must be under 100 msec
        - metric: built-in/p95.0
          upperLimit: 100
    ```

??? note "Iter8 and Helm"

    If you are familiar with Helm, you probably noticed that the load-test folder resembles a Helm chart. This is because, Iter8 experiment charts are Helm charts under the covers. The iter8 run command used above combines the experiment chart with values to generate the experiments.yaml file, much like how Helm charts can be combined with values to produce Kubernetes manifests.

## Assert outcomes

Assert that the experiment completed without any failures and SLOs are satisfied

```shell
---
id: assert-success
---
cd /tmp/load-test && iter8 assert -c completed -c nofailure -c slos
```

## Generate report

Generate a report of the experiment in HTML or text formats as follows.

=== "HTML"

    ```shell
    iter8 report -o html > report.html
    # open report.html with a browser. In MacOS, you can use the command:
    # open report.html
    ```

    ???+ note "The HTML report looks as follows"

        ![HTML report](https://iter8.tools/0.8/getting-started/images/report.html.png)

=== "Text"

    ```shell
    ---
    id: generate-text-report
    ---
    cd /tmp/load-test && iter8 report -o text
    ```
