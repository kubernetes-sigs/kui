---
title: Kubernetes &mdash; Deploying Applications
layout:
  1: left
---

# Deploying PHP Guestbook Application with Redis

This tutorial shows you how to build and deploy a simple, multi-tier
web application using Kubernetes and Kui. You will learn how to
**explore the structure** of this application. Once you are confident
in your understanding of the implications of its deployment, this
notebook can help you with taking that next step.

The guestbook application uses **Redis** to store its data. It writes
its data to a Redis **master** instance and reads data from multiple
Redis **slave** instances.

Although the Redis master is a single pod, you can make it highly
available to meet traffic demands by adding replica Redis slaves.

The guestbook application has a **web frontend** serving the HTTP
requests written in PHP. It is configured to connect to the
redis-master `Service` for write requests and the redis-slave service
for Read requests.

---

First, let's create a namespace to keep our work isolated:

```bash
kubectl create ns kui-notebook-3
```

## Learning the Application's Structure

This application consists of the following components:

- A single-instance Redis master to store guestbook entries
- Multiple replicated Redis instances to serve reads
- Multiple web frontend instances

By executing `kubectl get -f <dir>`, where `<dir>` is the directory
that contains the application's resource definitions, you can view a
visual summary of this application structure. This summary lets you
**preview the deployment**.

#### Here, we make sure to indicate that we want to target this application to the namespace we created on the left.

```bash
kubectl get -f plugins/plugin-kubectl/tests/data/k8s/application/guestbook/ -n kui-notebook-3
```

## Deploying the Application

By executing the following `apply -f` command view, you can initiate
the deployment of this application to your cluster.

```bash
kubectl apply -n kui-notebook-3 -f plugins/plugin-kubectl/tests/data/k8s/application/guestbook/
```

## Inspecting the Running Application

By drilling down the resource in the above view, you can inspect the
status of the running deployment. For example, the following sidecar
is the result of clicking `Deployment` `frontend`.

```bash
kubectl get Deployment frontend -o yaml -n kui-notebook-3
```
