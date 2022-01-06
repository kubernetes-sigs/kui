---
title: Welcome to Kui
layout:
  1: left
---

# Kui: CLI-driven Graphics for Kubernetes

We love CLIs, and think they are critical for interacting in a
flexible way with the cloud. We need the power to go off the
rails. But **ASCII is tedious**. Kui takes your normal kubectl command
line requests and responds with graphics. Instead of ASCII tables, you
are presented with sortable ones. Instead of copying and pasting long
auto-generated resource names to drill down, in Kui **you just
click**.

## Installation

=== "Mac"

    For MacOS, this is simplified by the use of [Homebrew](https://brew.sh/):

    ```bash
    ---
    id: kui-installation-mac
    validate: brew info kui
    ---
    brew install kui
    kubectl kui get pods
    ```

=== "Linux and Windows"
    
    [Kui-Linux-x64.zip](https://linux-zip.kui-shell.org) **|** [Kui-Linux-arm64.zip](https://linux-arm64-zip.kui-shell.org) **|** [Kui-Win32-x64.zip](https://win32-zip.kui-shell.org)

???+ tip "Kui as a `kubectl` plugin"

    To run Kui as `kubectl kui`, add the unpacked directory to your
    PATH. For users of Homebrew on macOS, this should happen automatically.


### Contributing

Kui uses [Electron](https://electronjs.org). Using Electron, Kui can
be distributed as a double-clickable platform application, as a static
single-page web application, or as a fully hosted client-server web
app.

If you want to help, please take a look at the [developer
guide](https://github.com/IBM/kui/wiki) and our
[guidelines](CONTRIBUTING.md).

---

## Listing Kubernetes Resources and Drilling Down

To use Kui, type a normal `kubectl` command, and you should quickly
see interactive graphics in response. You may use `k` as a shorthand
for `kubectl`.

First, let us try viewing our pods:

```bash
k get pods
```

Clicking on a table cell gives you a quick way to drill down the
following details:

```bash
k get Pod frontend-6c6d6dfd4d-h6htk -o yaml
```

### Events

Kui has enhanced views over Kubernetes events.

```bash
k get events
```

---

## Viewing an Kubernetes Application

Kui also has enhanced views over heterogeneous collections of
resources. Both `apply` and `get` operations present a unified view of
these resources, along with links to view the source yaml for each
group of resources.

```bash
k apply -f plugins/plugin-kubectl/tests/data/k8s/application/guestbook/
```
