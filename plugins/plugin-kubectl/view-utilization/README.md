# Kubernetes Utilization Kui Plugin

## Terminology

The terms in this section in quotes come from kubernetes itself. The
rest of the text in this section is our interpretations of these
terms.

### Node Terminology

Each node has a cpu and a memory share that can be allocated to
containers. The two pertinent figures are:

    - "Capacity": total cpu/memory share
    - "Allocatable": remaining cpu/memory share

### Container Terminology

Each container will request resource shares from its owning node. The
resource requests can be constrained in two ways:

    - "Limit": maximum cpu/memory share to grant the container
    - "Request": minimal cpu/memory share it needs in order to function

## Credits

Originated from: https://github.com/etopeter/kubectl-view-utilization/
