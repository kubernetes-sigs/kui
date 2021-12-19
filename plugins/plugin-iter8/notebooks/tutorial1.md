---
title: Iter8 Tutorial 1
layout:
  1: left
---

# Application Upgrade versus SLOs

A new version of your application is ready. It has passed its unit and
functional test cases, but is it ready to deploy to production? We
must first ensure that the new version meets our expected _service
level objectives_, such as acceptable error rate or mean request
latency.

Iter8 helps you gain confidence in upgrades by performing **rigorous
statistical analysis** of these metrics.

In this guide, we dark launch the new version and use Iter8 to
determine with statistical confidence if SLOs are met.

### Activities

- **[Deploy the candidate application](#kui-link-ad06f8b4-bd31-40cf-98af-e6417f306a1a)** _blank_ We use a hello world app.
- **[Start the Iter8 experiment](#kui-link-8747f6df-3926-4e90-a75b-febced2dd1cd)** _blank_ Define **success metrics**, and initiate an _Iter8 Experiment_. Iter8 will drive load, and track the success metrics for us.
- **Monitor progress** _minor_ Live views help you track the experiment.
- **[Understand Iter8's recommendation](#kui-link-94e4c2c8-bd90-4467-b569-610510ed1269)** _blank_ When the evaluation period ends and the success metrics have been met, Iter8 marks the Experiment as successful.
- **Optionally promote the candidate** _minor_ If you are content with the results of the Experiment, you may promote the candidate to production.

---

> What you will learn:
>
> - How Iter8 helps you upgrade an application so that it **continues to satisfy SLOs**
> - How to create an Iter8 **Experiment** that initiates such a validation check

## Deploy the candidate application

First, we use kubectl apply to deploy the candidate version of our
sample application.

```bash
---
id: ad06f8b4-bd31-40cf-98af-e6417f306a1a
status: done
responseEncoding: base64+gzip
response: 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
---
k apply -f https://raw.githubusercontent.com/kalantar/iter8/cil/samples/cil/first-exp/hello-candidate.yaml
```

## Start the Iter8 experiment

We run an Iter8 experiment to verify that the candidate version
satisfies a set of service level objectives (SLOs). In this case, we
are focus on the metrics below, but these can be any in-built or
_user-defined_ metrics.

1. Mean latency for application requests should be < **500**
2. 95th percentile latency should be less than **1000**
3. Error rate to should be less than **0.01**

Our **Iter8 experiment** will generate traffic to the
_hello-candidate_ version of the application and will monitor the
metrics that get generated as a result of this traffic. If the metrics
satisfy the SLOs defined then we can go ahead and promote this
version.

```bash
---
id: 8747f6df-3926-4e90-a75b-febced2dd1cd
---
k apply -f https://raw.githubusercontent.com/kalantar/iter8/cil/samples/cil/first-exp/experiment.yaml
```

> As part of an **experiment definition**, Iter8 lets you define a set
> of **objectives** and **indicators**. If you click to expand the
> "Show experiment.yaml" above, you will see that this experiment
> defines three metrics under criteria: mean-latency, error-rate, and
> latency-95th-percentile. In addition, you can specify the bounds of
> acceptable values for each metric. For example, this experiment
> specifies a maximum mean-latency of 500 milliseconds.

## Monitor the progress of the experiment

This notebook automatically watches the progress of `kubectl`
commands. See above. In your terminal, you may monitor the status of a
running experiment using `kubectl get experiment hello-experiment --watch`

```bash
---
id: 94e4c2c8-bd90-4467-b569-610510ed1269
---
kubectl get experiment hello-experiment --watch
```

## Understanding Iter8's recommendation

When an experiment finishes, its status is set to **Completed**. The
message will indicate whether or not it has **Failed**. If it
completes without failure, Iter8 will recommend whether or not the
version should be promoted or not depending on whether or not it
satisfies the required SLOs. You can execute the below command to get
details of the observed metrics and which satisfied their objectives.

```bash
iter8ctl describe hello-experiment
```

> When running locally in your terminal you will need to instal the
> **iter8ctl** using `GOBIN=/usr/local/bin go install github.com/iter8-tools/etc3/iter8ctl@latest`

## Optionally, promote the candidate version

Once an experiment has finished, you can go ahead and promote this
candidate. This can be done using any existing delivery pipeline, by
applying the manifest (`kubectl apply -f <yaml for the latest candidate>`), or by using a _task_ specified in the Iter8
experiment. Iter8 provides a facility to execute tasks when the
experiment finishes. For example, the following task might be
used. See, for example,
[this](https://iter8.tools/0.7/reference/tasks/run/) task.
