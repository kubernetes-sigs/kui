---
title: Kubernetes -- Working with Jobs
layout:
  1: left
---

# Kubernetes Jobs

Kubernetes supports parallel batch job scheduling via the **Job**
resource type. A Job creates one or more Pods and ensures that a
specified number of them successfully terminate.

In this notebook, you will learn how to create a job to run multiple
tasks in parallel and use Kui's **Sequence Diagram** to inspect jobs
and pods.

### Controlling Parallelism

Kubernetes Jobs use two parameters, `completions` and `parallelism`,
to control how a Job is subdivided into units of work. Each unit of
work is executed by a **Pod**. In the example on the right, we
specified values of `20` and `4`, respectively. These parameters tell
Kubernetes to execute the Job across 20 Pods, but schedule at most 4
Pods to run concurrently.

You can see these values defined by expanding the `job.yaml` source.

You can also see the execution pattern visualized in the **Sequence
Diagram** view. Note how there are steps of four Pods executed at a
time, with a new Pod being scheduled only when one of the prior Pods
has completed its work.

The gray hashed prefix of every bar represents the **cold start time**
of the Pod. This is the time spent bringing up the Pod, and is in
contrast to the work you actually want to accomplish. If the cold
start penalty is high, you may want to consider coarsening your work:
try to do more work per Pod.

---

## Scheduling a Job

First, let's create a namespace to keep our work isolated:

```bash
kubectl create ns kui-notebook-2
```

To schedule a job, use `kubectl apply` with a definition of your
job. The following command applies a `job.yaml` to our scratch
namespace. The response from this command is a live Sequence Diagram
visualization.

```bash
k apply -f plugins/plugin-kubectl/tests/data/k8s/job.yaml -n kui-notebook-2
```

This visualization shows how the sub-tasks of our Job are scheduled,
over time. You can see concurrency and cold start penalties. The live
table will update as tasks are scheduled and complete.

You may also switch to a list or grid view by clicking the toolbar
buttons at the bottom of the view.

## Inspecting the details of Job execution

To view the details of the tasks, you may click on any of the rows of
the Sequence Diagram (or rows of the Table view; or cells of the Grid
view). After Kubernetes runs the tasks in Pods, so, after clicking on
a task in the above view, the drilldown view you will see is a Pod
view!

```bash
kubectl get Pod pi-j272m -o yaml -n kui-notebook-2
```
