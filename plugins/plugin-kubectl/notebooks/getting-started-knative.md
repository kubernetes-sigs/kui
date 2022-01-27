---
layout: wizard
snippets:
    basePath: https://raw.githubusercontent.com/knative/docs/main/docs/snippets
---
# Getting Started with Knative

Knative is an open source project that adds components for deploying, running, and managing serverless, cloud-native applications to Kubernetes. Knative eliminates the tasks of provisioning and managing servers. This lets developers focus on their code without having to worry about setting up complex infrastructure.

---

## Before you begin: About this Guidebook and Pre-requisites

> This Getting started guide provides instructions on how to install a local distribution of Knative for development use. The Knative Quickstart Environments shown in this guide are for experimentation use only. For production installation, see our [Installing Guide](../install/README.md)

Before you can get started with a Knative Quickstart deployment you must have the following pre-requisites: 
- Docker
- kind or minikube
- Kubernetes CLI
- Knative CLI.

Let's check if you have Docker installed ...

```bash
---
id: docker-prereq
validate: (docker --version >& /dev/null) && exit 0 || exit 1
---
if [ docker --version >& /dev/null ];
    then echo "Your Docker is good"; exit 0
    else echo "Please install Docker"; exit 1
fi
```

---

### Check for Kind or minikube: This will help us prepare a local Kubernetes cluster

You can use [`kind`](https://kind.sigs.k8s.io/docs/user/quick-start){target=_blank} (Kubernetes in Docker) or [`minikube`](https://minikube.sigs.k8s.io/docs/start/){target=_blank} to run a local Kubernetes cluster with Docker container nodes.

Let's check if you have kind or minikube installed ...

```bash
---
id: kind-minikube-prereq
validate: ((kind get clusters >& /dev/null) || (minkube start >& /dev/null)) && exit 0 || exit 1
---
if [ kind get clusters --client >& /dev/null ];
    then echo "Kind found!"; exit 0
elif [ minikube start --client >& /dev/null ];
    then echo "minikube found!"; exit 0
else echo "Please install Kind or Minikube"; exit 1
fi
```

---

### Check for the Kubernetes CLI: kubectl installation

The [Kubernetes CLI (`kubectl`)](https://kubernetes.io/docs/tasks/tools/install-kubectl){target=_blank}, allows you to run commands against Kubernetes clusters. You can use `kubectl` to deploy applications, inspect and manage cluster resources, and view logs.

Let's see if you have kubectl installed ... 

```bash
---
id: kubectl-prereq
validate: (kubectl version --client >& /dev/null) && exit 0 || exit 1
---
if [ kubectl version --client >& /dev/null ];
    then echo "You have kubectl installed!"; exit 0
    else echo "Please install kubectl"; exit 1
fi
```

---

### Install the Knative CLI

The Knative CLI (`kn`) provides a quick and easy interface for creating Knative resources, such as Knative Services and Event Sources, without the need to create or modify YAML files directly.

`kn` also simplifies completion of otherwise complex procedures such as autoscaling and traffic splitting.

--8<-- "install-kn.md"

---

## Install the Knative "Quickstart" environment: This will help us use knative on a local machines

You can get started with a local deployment of Knative by using the Knative `quickstart` plugin.

--8<-- "quickstart-install.md"