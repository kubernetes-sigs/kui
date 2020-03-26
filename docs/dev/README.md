# Kui Developers Guide

Kui is written in [TypeScript](https://www.typescriptlang.org/), which
is a typed variant of JavaScript in fairly wide use now across the
JavaScript ecosystem.

- [Edit-debug Loop](#edit-debug-loop)
- [Running Tests](#local-testing)
- [Building a Distribution](#building-a-distribuition)
- [Live Webpack Development](live-webpack-development.md)

To get started with developing and extending Kui, first clone and
build the code, and initiate a webpack watcher:

```bash
git clone git@github.com:IBM/kui.git
export PATH=$PWD/kui/bin:$PATH
cd kui && npm ci
npm run watch
```

To verify your watcher, you can launch an electron client via `npm run open`. You should then be able to issue e.g. filesystem command ssuch
as `ls`, and click on the links in the table. Clicking on a JSON or
YAML file should display the contents in an editor in the sidecar.

## Edit-debug Loop

This project is coded in [TypeScript](https://www.typescriptlang.org) with
hot reloaded [webpack-dev-server](https://webpack.js.org/configuration/dev-server/).
For the most part, after the TypeScript compilation completes, edits to source code
can be automatically incorporated into a running instance of the graphical `kui shell`.
The turnaround time, from edit to use, is usually on the order of a few seconds.

## Local Testing

To run all tests:

```bash
> npm test
```

To filter tests, e.g. to run test suites with 'About command' in their title:

```bash
> TEST_FILTER='About command' npm test
```

## Building a Distribution

Kui is an [Electron](https://electron.atom.io/) application. Electron
is a framework for developing rich client applications, using browser
technologies. Electron applications can be built to provide local
double-clickable clients on Windows, macOS, and Linux. Browser
deployments are also possible, further extending the reach of Kui.

To pack up a set of platform clients for subsequent distribution, you
may leverage several npm targets expressed in the
[package.json](../../package.json):

This command will build a macOS tarball, and place it in
`dist/electron/Kui-darwin-x64.tar.bz2`:

```sh
npm run build:electron:mac
```
