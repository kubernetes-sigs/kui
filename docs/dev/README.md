# Shell Development

The Shell is an [Electron](https://electron.atom.io/)
application. Electron is a framework for developing rich client
applications, using browser technologies. Electron applications are
cross-platform, at least to the extent that the framework has builds
for Windows, macOS, and Linux.

   - [Quick Start Guide](#quick-start-guide)
   - [Acquiring an OpenWhisk Authorization Key](#acquiring-an-openwhisk-authorization-key)
   - [Lay of the land](lay-of-the-land.md) describes the structure and
     layout of the code
   - [Running Local Tests](local-testing.md) shows how to run the test
     suite locally

## Quick Start Guide

Developing against a local OpenWhisk is highly recommended. This is
not a strict requirement. However, to run local tests, a local
OpenWhisk is currently required. See below for guidance on acquiring
an OpenWhisk authorization key. Once you have configured your
`~/.wskprops` to point to your desired OpenWhisk service, you can
begin Shell development:

```bash
$ git clone git@github.com:ibm-functions/shell.git
$ cd shell
$ ./tools/setup-npmrc.sh && npm install
$ ./fsh.js
```

If you see the help menu in your terminal, then so far, so good. Note:
if you look at the package.json's `bin` field, you will observe that
the `fsh.js` launcher is named `fsh` when non-developers install via
e.g. `npm install ibm-functions/shell`.

### Installing the Graphical Bits

By default, this `npm install` will not install the graphical
components, i.e. Electron. This design allows for lightweight
installations that support headless environments.  To install the
graphical bits:

```bash
npm run install-ui
./fsh.js shell
```

If you see the Shell UI open up, then this part was successful.

## The Edit-Debug Cycle

For the most part, any edits to UI code can be incorporated into that
running instance by simply reloading the Shell, as you would a browser
window; e.g. Command+R on macOS, or Control+R on Windows and
Linux. This allows you to quickly edit and debug changes, without slow
rebuild and restart steps.

### More Advanced Scenarios

There are several cases where a simple reload will not suffice to
realize your changes.

 1. **Adding new commands** For efficiency, the Shell relies on a
    precompiled model of the command tree. This allows the Shell to
    load plugin code lazily, as needed by command execution. Thus, if
    you add a new command, you must recompile the command
    registry: `cd app && npm run compile`

 2. **Changing code in the main process** Electron applications
    consist of two groups of processes: the renderer processes
    (e.g. one per window, one per web view, one per web worker, etc.),
    and the "main" or server-side processes. The javascript code
    directly within the `app` directory (e.g. `main.js` and
    `headless.js`) are run in the main/server process. Thus, changes
    to these files requires a restart of the application, which you
    can do by quitting any instances of the the graphical UI and
    restarting them via `./fsh.js shell`.

## Acquiring an OpenWhisk Authorization Key

Currently, the Shell assumes you have an OpenWhisk authorization
key. You have two options for acquiring one:

 - Using IBM Cloud Functions
 - Using a Local OpenWhisk

### Option 1: Using IBM Cloud Functions

 1. [Install `ibmcloud`](https://console.bluemix.net/docs/cli/reference/bluemix_cli/get_started.html)
 2. `ibmcloud login`
 3. `ibmcloud target --cf`
 4. `ibmcloud wsk list`

### Option 2: Setting up a Local OpenWhisk

For complete details, please consult
the
[OpenWhisk documentation](https://github.com/apache/incubator-openwhisk). Here,
we summarize one reliable way to do so. This recipe requires that you
have already installed [Vagrant](https://www.vagrantup.com)
and [VirtualBox](https://www.virtualbox.org/).

```bash
$ git clone --depth=1 https://github.com/apache/incubator-openwhisk.git openwhisk
$ cd openwhisk/tools/vagrant
$ ./hello
$ wsk property set --apihost 192.168.33.13 --auth `vagrant ssh -- cat openwhisk/ansible/files/auth.guest`
```
