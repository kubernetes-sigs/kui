# Kui Developers Guide

To get started with developing and extending Kui, first clone and
build the code:

```bash
git clone git@github.com:IBM/kui.git
export PATH=$PWD/kui/bin:$PATH
cd kui && npm install
kubectl kui version
```

The last of those commands will verify that `kui` was built
properly. You may also try `kubectl kui shell` if you want to test out
the graphical shell environment.

If you have already set `KUBECONFIG` (or `.wskprops`, for Apache
OpenWhisk users), then you are good to go, as far as credentials are
concerned. Otherwise, consult the [Kui installation
guide](../installation.md) for more information on setting up
credentials.

  - [Coding Strategy](#coding-strategy)
  - [Packaging](packaging.md)
  - [Running Tests](#local-testing)
  - [Live Webpack Development](live-webpack-development.md)

## Coding Strategy

Kui is an [Electron](https://electron.atom.io/) application. Electron
is a framework for developing rich client applications, using browser
technologies. Electron applications can be built to provide local
double-clickable clients on Windows, macOS, and Linux. Browser
deployments are also possible, further extending the reach of Kui.

Kui is written in [TypeScript](https://www.typescriptlang.org/), which
is a typed variant of JavaScript in fairly wide use now across the
JavaScript ecosystem. After the initial `npm install`, you can set up
a compile watcher via this command, executed in the top-level
directory:

```bash
> npm run watch
```

For the most part, after the TypeScript compilation completes, edits
to source code can be incorporated into a running instance of the
graphical `kui shell` simply by reloading the Shell: Command+R on
macOS, or Shift+Control+R on Windows and Linux. The turnaround time,
from edit to use, is usually on the order of a few seconds.

### More Advanced Scenarios

There are several cases where a simple reload will not suffice to
realize your changes.

 1. **Adding new commands** For efficiency, Kui relies on a
    precompiled model of the command tree. This allows Kui to load
    plugin code lazily. If you add a new command, or move a command
    from one plugin to another, you must therefore recompile the
    command registry:

    ```bash
    > npm run compile
    ```

 2. **Changing code in the main process** Electron applications
    consist of two groups of processes: the renderer processes
    (e.g. one per window, web view, web worker, etc.), and the "main"
    or server-side processes. The javascript code under the
    `packages/app/src/main` directory (e.g. `main.js` and `headless.js`) are
    run in the main/server process. Thus, changes to these files
    require a full quit and relaunch of the Electron application.

 3. **Changing the HTML templates** Changes to files under the
    `packages/app/templates/` directory, such as `packages/app/templates/index.html` require a
    rebuild, accomplished via

    ```bash
    > cd app && npm run build
    ```

## Local Testing

### Setup:
* To install Kubernetes on your local machine, consult the official [Kubernetes Local Machine Solutions](https://kubernetes.io/docs/setup/pick-right-solution/#local-machine-solutions) .  

### Testing:
* Go to the root of the project folder
* Run all the test suites
```bash
> npm test
```
* Filter test execution
```bash
> TEST_FILTER='About command' npm test # Only run test suites containing 'About command' in suite titles
```
