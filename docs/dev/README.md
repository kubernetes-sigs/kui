# Cloning and Developing for Kui

To get started, the following commands will clone the code locally:

```bash
git clone git@github.com:IBM/kui.git
export PATH=$PWD/kui/bin:$PATH
cd kui && npm install
kubectl kui version
```

The last of those commands is to verify that `kui` was built
properly. You may also try `kubectl kui shell` if you want to test out
the graphical shell environment.

If you have already set `KUBECONFIG`, then you are good to
go, as far as credentials are concerned. Otherwise, or if you are an
Apache OpenWhisk user, consult [the installation
guide](../installation.md) for more information on setting up
credentials.

## Introductions

Kui is an [Electron](https://electron.atom.io/) application. Electron
is a framework for developing rich client applications, using browser
technologies. Electron applications are cross-platform, at least to
the extent that the framework has builds for Windows, macOS, and
Linux.

   - [Quick Start Guide](#quick-start-guide)
   - [Lay of the land](lay-of-the-land.md) describes the structure and
     layout of the code
   - [Running Local Tests](local-testing.md) shows how to run the test
     suite locally

## The Edit-Debug Cycle

For the most part, any edits to UI code can be incorporated into that
running instance by simply reloading the Shell, as you would a browser
window; e.g. Command+R on macOS, or Control+R on Windows and
Linux. This allows you to quickly edit and debug changes, without slow
rebuild and restart steps.

### More Advanced Scenarios

There are several cases where a simple reload will not suffice to
realize your changes.

 1. **Adding new commands** For efficiency, Kui relies on a
    precompiled model of the command tree. This allows Kui to load
    plugin code lazily, as needed by command execution. Thus, if you
    add a new command, you must recompile the command registry: `cd
    app && npm run compile`

 2. **Changing code in the main process** Electron applications
    consist of two groups of processes: the renderer processes
    (e.g. one per window, one per web view, one per web worker, etc.),
    and the "main" or server-side processes. The javascript code under
    the `app/src/main` directory (e.g. `main.js` and `headless.js`)
    are run in this main/server process. Thus, changes to these files
    requires a restart of the application, which you can do by fully
    quitting any instances of the the graphical UI (e.g. via Command+Q
    or Ctrl+Q, depending on your platform) and restarting them via
    `./bin/kui shell`.
