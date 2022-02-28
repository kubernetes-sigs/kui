---
title: Kubernetes &mdash; Working with Jobs
layout:
    1: left
---

# :material-kubernetes:

# Batch Jobs in Kubernetes

A Job creates one or more Pods and will continue to retry execution of the Pods until a specified number of them successfully terminate. As pods successfully complete, the Job tracks the successful completions. When a specified number of successful completions is reached, the task (ie, Job) is complete. Deleting a Job will clean up the Pods it created. Suspending a Job will delete its active Pods until the Job is resumed again.

---

???+ tip "Controlling Parallelism"

    Kubernetes Jobs use two parameters, `completions` and `parallelism`, to control how a Job is subdivided into units of work. Each unit of work is executed by a Pod.

## Scheduling a Job

First, let's create a namespace to keep our work isolated:

```bash
---
validate: kubectl get ns kui-notebook-2
cleanup: kubectl delete ns kui-notebook-2
---
kubectl create ns kui-notebook-2
```

To schedule a job, use `kubectl apply` with a definition of your
job. The following command applies a `job.yaml` to our scratch
namespace. The response from this command is a live visualization of
the progress of the Job.

```bash
---
validate: kubectl get job pi -n kui-notebook-2
cleanup: kubectl delete job pi -n kui-notebook-2
---
k apply -f https://raw.githubusercontent.com/kubernetes-sigs/kui/master/plugins/plugin-kubectl/tests/data/k8s/job2.yaml -n kui-notebook-2
```

This visualization shows how the tasks of our Job are scheduled, over
time. You can see concurrency and cold start penalties. The live table
will update as tasks are scheduled.

---

```bash
---
execute: now
---
kubectl dashboard job -n kui-notebook-2 --watch
```

---

```bash
---
execute: now
---
kubectl get events -n kui-notebook-2 --field-selector=involvedObject.kind=Pod --field-selector=involvedObject.kind=Job --watch
```
