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
