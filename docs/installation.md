# Kui Installation Guide

This page will help you to install and configure Kui. You have a few
installation options; pick the one that best suits your environment.

## Double-clickable app Download

You may opt to download an double-clickable platform binary. With this
option, you avoid having to worry about Node.js dependencies.
However, currently, you will not be able to use Kui from your favorite
terminal (such support should come soon); Kui's graphical shell offers
a command line experience.

[Kui-MacOS.tar.bz2](https://macos-tarball.kui-shell.org) **|** [Kui-Linux-x64.zip](https://linux-zip.kui-shell.org) **|** [Kui-Win32-x64.zip](https://win32-zip.kui-shell.org)

Coming soon: MacOS .dmg, Linux .deb, Linux .rpm

##### Example Download for MacOS double-clickable

> curl -L https://macos-tarball.kui-shell.org/ | tar jxf -  
> open Kui-darwin-x64/Kui.app

### Important Note on Unsigned Builds

Currently, the Kui double-clickable application builds are not
signed. Therefore, you will likely see a security warning the first
time you launch these Kui builds. If this is a show-stopper for you,
we understand! You may always choose to [git clone and
build](./dev/README.md) Kui yourself.

### Important Note

The download links provided on this page include Kubernetes support
from the [kubeui repository](https://github.com/kui-shell/plugin-kubeui).
The repository you are currently investigating contains the core
support of the Kui framework. The kubeui repository uses this core
framework to build out support for Kubernetes, Helm, and other aspects
of the Kubernetes world. For more information on using the Kui core
framework to develop your own custom clients and plugins, check out the
[API docs](https://apidocs.kui-shell.org/).

## Next Steps

- Return to the [README](../README.md)
- Develop your own custom Kui client! [API docs](https://apidocs.kui-shell.org/)
