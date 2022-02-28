---
title: Kubernetes &mdash; CRUD Operations
layout:
  1: left
---

# Declarative Management in Kubernetes

Kubernetes objects can be created, updated, and deleted by storing
multiple object configuration files in a directory and using `kubectl apply` to recursively create and update those objects as needed. This
method retains writes made to live objects without merging the changes
back into the object configuration files.

---

## Creating Resources

It is good practice to experiment in a separate namespace. Thus, we
first create a scratch namespace.

```bash
---
validate: k get ns kui-notebook-1
cleanup: k delete ns kui-notebook-1
---
k create ns kui-notebook-1
```

Now we can use `kubectl apply` to create a deployment in the
`kui-notebook-1` namespace.

```bash
---
validate: k get deploy myapp -n kui-notebook-1
cleanup: k delete -f https://raw.githubusercontent.com/kubernetes-sigs/kui/master/plugins/plugin-kubectl/tests/data/k8s/deployment.yaml -n kui-notebook-1
---
k apply -f https://raw.githubusercontent.com/kubernetes-sigs/kui/master/plugins/plugin-kubectl/tests/data/k8s/deployment.yaml -n kui-notebook-1
```

When running this yourself, the `apply` table will be live, with the
**Status** cells updating as resources become available. You may also
click to expand the source reference.

## Inspecting Resources

To inspect the `nginx-deployment` you just applied, you can **click
the resource name** in the table above. Kui will then execute the
command-line `kubectl get Deployment.v1.apps -n kui-notebook-1 nginx-deployment -o yaml` , so you can further inspect this deployment
by a variety of resources, such as brief summary, last applied info,
and a full yaml content. You can also use the following view to
explore the related resources and involved events of this deployment.

```bash
k get Deployment.v1.apps -n kui-notebook-1 myapp -o yaml
```

The above drilldown view shows a set of views over the Deployment,
such as a brief summary of the resource, the configuration as of the
_previous_ call to `apply`, and the raw yaml code. You can also
explore related resources, such as the Pods managed by the Deployment,
or Kubernetes events that pertain to the Deployment.

Clicking the edit icon allows you to modify and apply updates directly
from that view. Clicking the delete icon will, with your confirmation,
process a `kubectl delete` against that resource.
