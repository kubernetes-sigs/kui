# Kui Developers Guide

Kui is written in [TypeScript](https://www.typescriptlang.org/), which
is a typed variant of JavaScript in fairly wide use now across the
JavaScript ecosystem.

- [Clone and Build](#clone-and-build)
- [Coding Strategy](#coding-strategy)
- [Packaging](packaging.md)
- [Running Tests](#local-testing)
- [Live Webpack Development](live-webpack-development.md)

## Clone and Build

To get started with developing and extending Kui, first clone and
build the code, and initiate a webpack watcher:

```bash
git clone git@github.com:IBM/kui.git
export PATH=$PWD/kui/bin:$PATH
cd kui && npm ci
npm run watch:electron
```

To verify your watcher, you can launch an electron client via `npm start`. You should then be able to issue e.g. filesystem command ssuch
as `ls`, and click on the links in the table. Clicking on a JSON or
YAML file should display the contents in an editor in the sidecar.

## Coding Strategy

Kui is an [Electron](https://electron.atom.io/) application. Electron
is a framework for developing rich client applications, using browser
technologies. Electron applications can be built to provide local
double-clickable clients on Windows, macOS, and Linux. Browser
deployments are also possible, further extending the reach of Kui.

For the most part, after the TypeScript compilation completes, edits
to source code can be incorporated into a running instance of the
graphical `kui shell` simply by reloading the Shell: Command+R on
macOS, or Shift+Control+R on Windows and Linux. The turnaround time,
from edit to use, is usually on the order of a few seconds.

### More Advanced Scenarios

There are several cases where a simple reload will not suffice to
realize your changes.

1.  **Adding new commands** For efficiency, Kui relies on a
    precompiled model of the command tree. This allows Kui to load
    plugin code lazily. If you add a new command, or move a command
    from one plugin to another, you must therefore recompile the
    command registry:

    ```bash
    > npm run compile
    ```

2.  **Changing code in the main process** Electron applications
    consist of two groups of processes: the renderer processes
    (e.g. one per window, web view, web worker, etc.), and the "main"
    or server-side processes. The javascript code under the
    `packages/app/src/main` directory (e.g. `main.js` and `headless.js`) are
    run in the main/server process. Thus, changes to these files
    require a full quit and relaunch of the Electron application.

3.  **Changing the HTML templates** Changes to files under the
    `packages/app/templates/` directory, such as `packages/app/templates/index.html` require a
    rebuild, accomplished via

    ```bash
    > cd app && npm run build
    ```

## Local Testing

To run all tests:

```bash
> npm test
```

To filter tests, e.g. to run test suites with 'About command' in their title:

```bash
> TEST_FILTER='About command' npm test
```
