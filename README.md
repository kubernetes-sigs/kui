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

We love CLIs, and think they are critical for interacting in a
flexible way with the cloud. We need the power to go off the
rails. But ASCII is tedious. Kui takes your normal `kubectl` command
line requests and **responds with graphics**. Instead of ASCII tables,
you are presented with sortable ones. Instead of copying and pasting
long auto-generated resource names to drill down, in Kui **you just
click**. [Download Now!](#installation)

<img width="600" align="right" src="docs/readme/images/kui-experience.gif">

Watch and `apply` requests present you with live tables. Instead of
poring over complex YAML, you can browse the facets of your resources
in a tabbed UI. Drill down, drill up, and view logs or the events
related just to the resource of interest, again with Kui you can just
click.

Iterating through a table to find the needle in the haystack? With
Kui, you can click the rows in rapid succession, and Kui sends the
details to a side terminal; the main table will not scroll out of
view. If you are working with
[jobs](https://kubernetes.io/docs/concepts/workloads/controllers/job/),
you can see a "waterfall" diagram by simply executing `k get jobs`.

<img height="185" src="docs/readme/images/grid-watch.gif"><img height="185" src="docs/readme/images/sequence-diagram.png"><img height="185" src="docs/readme/images/pod.png">

<img width="575" align="right" src="docs/readme/images/minisplits.png">

In summary: Kui enhances your CLI experience, but is also fast. It
launches in 1-2 seconds, and can process standard `kubectl` commands
**2-3 times faster** than `kubectl` itself.

## Installation

For macOS, use [Homebrew](https://brew.sh):

```bash
brew install kui
kubectl kui get pods
open /Applications/Kui.app
```

For other platforms, download one of the following:

[Kui-Linux-x64.zip](https://linux-zip.kui-shell.org) **|** [Kui-Linux-arm64.zip](https://linux-arm64-zip.kui-shell.org) **|** [Kui-Win32-x64.zip](https://win32-zip.kui-shell.org)

> To use a `kubectl` plugin, make sure the unpacked directory is on your PATH.

> **Windows Warnings**: Please use forward slashes for filepaths, e.g. c:/users, not c:\users.

### Rolling Your Own

Don't trust the prebuilt binaries? We hear you. [Roll your own
Kui](https://github.com/IBM/kui/wiki#getting-started).

## Contributing

Kui uses [Electron](https://electronjs.org), which allows for
distributing clients either as a local platform application, or as a
hosted browser-based client. If you want to help, please take a look
at the [developer guide](https://github.com/IBM/kui/wiki) and our
[guidelines](CONTRIBUTING.md).

## Code of Conduct

Participation in the Kubernetes community is governed by the [Kubernetes Code
of Conduct](https://github.com/kubernetes-sigs/krew/blob/master/code-of-conduct.md).
