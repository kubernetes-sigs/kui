# Lay of the Land

This document describes the structure and layout of the source files.

   - [About Electron](#about-electron)
   - [Theming](#theming)
   - [Shell Core](#shell-core)
   - [Shell Plugins](plugins.md)
   - [Tests](tests.md)

## About Electron

Electron applications consist of two processes: the *renderer*, which
is Chromium, and the *main* process, which runs a v8 JavaScript
engine. The Shell bootstraps itself from `app/main.js`. If running in
headless mode, main hands control to `app/headless.js`. Headless mode
is specified via the `--headless` command line option. You can see
this employed by the `app/bin/fsh` helper script. Note that changes to
main-process source files will require a restart (rather than reload)
of the application.

Here is a list of the most important main-process source:

  - `app/main.js`, `app/headless.js`, `app/menu.js`, `app/store.js`,
    `app/tray.js` (the last is currently unused, but can support
    e.g. an upper-right menu on macOS, or a Windows tray menu).

The renderer process will load the top-level page content, located in
`app/index.html`. The rest of the logic is broken into three primary
pieces: theming, the Shell core, and the Shell plugins.

## Theming

The CSS content is located in the `app/content/css/`
directory. Currently, there is one example theme layer, located in
`app/content/css/themes/ibm.css`, which gives an IBM Cloud look to the
Shell.

Some cleanup work is currently needed here, to factor out more of the
theming from the main `app/content/css/ui.css` and `app/index.html`
files.

## Shell Core

At the core of the Shell are two view frameworks (REPL and Sidecar),
the plugin management subsystem, and the command resolution subsystem.

  - the **REPL view** is implemented in `app/content/repl.js`. This is what
    you first see when launching the graphical (i.e. not headless)
    Shell.

  - the **sidecar view** is currently implemented in
    `app/content/ui.js`. This is what you see opening from the right,
    after a request to view an entity. Normally, the sidecar will
    occupy about 60% of the screen width, when open. The sidecar also
    supports running in full-width mode; e.g. this is the behavior of
    `app preview` and the `grid` activation visualization, when
    launched from headless mode. Some refactoring is necessary to move
    this into a better spot.
   
  - the **plugin manager** is implemented in
    `app/content/plugins.js`. Its job is to scan for plugins, and load
    them upon request. In order to offer fast load times, the Shell
    requires that plugins be scanned in advance. The scan computes a
    topological dependence DAG over the plugins. This DAG allows for
    plugins to be loaded, quickly, on demand, rather than loading them
    all at startup time. You will see in `app/package.json`, that `npm
    install`, after the required node modules have been installed,
    invokes `dist/compile.js`. If, in the process of development, you
    add, remove, or otherwise change the way a command will map to
    plugins, you **must** re-execute `(cd dist && ./compile.js)`, and
    then reload the renderer process.
  
  - the **command resolver** is implemented in
    `app/content/command-tree.js`. Its job is to map a requested
    command string to the matching plugin that can service the
    command.
