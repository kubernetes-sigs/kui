# Kui: CLI-driven Graphics for Kubernetes

[![GitHub Stars](https://badgen.net/github/stars/IBM/kui)](https://github.com/IBM/kui/stargazers)
[![GitHub Forks](https://badgen.net/github/forks/IBM/kui)](https://github.com/IBM/kui/network/members)
![ts](https://flat.badgen.net/badge/-/TypeScript?icon=typescript&label&labelColor=blue&color=555555)
![Electron](https://flat.badgen.net/badge/Electron/11/orange)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg?style=flat-square)](https://opensource.org/licenses/Apache-2.0)
[![test](https://github.com/kubernetes-sigs/kui/actions/workflows/test.yaml/badge.svg)](https://github.com/kubernetes-sigs/kui/actions/workflows/test.yaml)

> Help us make Kubernetes tools better by filling out a [quick 2
> minute survey](https://forms.gle/Kq5s9yHcrRW83gw9A) on your tool
> preferences. Thanks!

<img width="600" align="right" src="docs/readme/images/kui-experience.gif">

We love CLIs, and think they are critical for interacting in a
flexible way with the cloud. We need the power to go off the
rails. But ASCII is tedious.

Kui takes your normal `kubectl` command line requests and **responds
with graphics**. Instead of ASCII tables, you are presented with
sortable ones. Instead of copying and pasting long auto-generated
resource names, in Kui **you just click**.

Kui is also fast. It launches in seconds, and can process `kubectl`
commands **2-3 times faster** than `kubectl` itself.

<img height="185" src="docs/readme/images/grid-watch.gif"><img height="185" src="docs/readme/images/sequence-diagram.png"><img height="185" src="docs/readme/images/pod.png">

## Installing the Pre-built Kui Graphical CLI

<img width="575" align="right" src="docs/readme/images/minisplits.png">

#### MacOS (Intel and AppleSilicon)

```bash
brew install kui
kubectl kui get pods
open /Applications/Kui.app
```

#### Windows and Linux

[Download and
unzip](https://github.com/kubernetes-sigs/kui/releases/latest), then
add the unzipped directory to your PATH. Now use `kubectl kui` or
launch the `Kui` executable to use Kui's built-in REPL.

> **Windows Warning**: Please use forward slashes for filepaths, e.g. c:/users, not c:\users.

### Using Kui as a Framework to Make Your Own Custom Graphical CLI

Kui is a framework for adding graphics to CLIs. Kui is a web app,
which allows for either a hosted client-server architecture, or, via
[Electron](https://electronjs.org), the distribution of
double-clickable applications.

Using this framework, you can design your own Kubernetes enhancements,
set a custom theme or custom icon, and enhance the commands of your
favorite CLI. Check out the [template
repo](https://github.com/kui-shell/KuiClientTemplate). If you
prototype Kubernetes enhancements that you feel would be generally
valuable, please PR them back here, for integration into to the [core
Kubernetes plugin](plugins/plugin-kubectl).

## Code of Conduct

Participation in the Kubernetes community is governed by the [Kubernetes Code
of Conduct](https://github.com/kubernetes-sigs/krew/blob/master/code-of-conduct.md).
