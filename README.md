# Kui Shell

[![Build Status](https://travis-ci.org/IBM/kui.svg?branch=master)](https://travis-ci.org/IBM/kui)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

Kui Shell offers a new development experience for building
cloud-native applications. By combining the power of familiar CLIs
with visualizations in high-impact areas, Kui enables you to
manipulate complex JSON and YAML data models, integrate disparate
tooling, and provides quick access to aggregate views of operational
data.

- [Install a prebuilt version](docs/installation.md)
- [Try it Live](https://hello.kui-shell.org/)
- Or, fork && clone && npm install

## This is a CLI, with Visualizations on the Side

Kui uses [Electron](https://electronjs.org) to provide you with an
augmented but CLI-focused development experience. By using Electron,
the same experience carries over, from local development on your
laptop, to a browser-based experience.

When running locally, you will have access to your filesystem and your
favorite terminal and text editor. To help with complex data, Kui
offers a suite of **visualizations**. You can gracefully flip between
the terminal and these visualizations, without having to switch to
your browser, log in, wait for pages to load, navigate through complex
menu structures, and so on.

For example, if you want a visual summary of your Kubernetes pods, you
can issue this command from your favorite terminal:

```
kubectl kui get pods --ui
```

If you are serverless developer using
[OpenWhisk](https://github.com/apache/incubator-openwhisk), you can
get a quick summary of your recent function invocations with a simple
command:

```
kubectl kui grid
```

If you are using [Apache
Composer](https://github.com/apache/incubator-openwhisk-composer/) to
compose your services together, you can get quick access to a
visualizatin of your compositions:

```
kubectl kui preview /path/to/my/composition.js
```

In all three cases, the story is the same: you can gracefully
transition into the world of visualizations without altering your
normal productive workflows.

- [Examples that work well without graphics](#cli-examples)
- [Examples that provide visualizations](#visualizations)

## CLI Examples (those that work well without graphics)<a name='cli-examples'></a>

Some commands work well in textual mode, without any need for
graphical assistance:

|Command                               | Output                        |
|:-------------------------------------|:------------------------------|
|`kui app create hello @demos/hello.js`|![ok: updated composition hello](https://ibm.box.com/shared/static/6mz8xvdw3wbldh7o111cuu7gnh1kwss4.png)|
|`kui app list`                        |![hello            composition](https://ibm.box.com/shared/static/w8m0jigs07bv59a7pl3lf3phwj27orwj.png)|
|`kui app async hello`                 |![ok: invoked hello with id ...](https://ibm.box.com/shared/static/b646dsiqylqv4b9wom6tj8xquitdkf27.png)|
|`kui session list`                    |![session list output](https://ibm.box.com/shared/static/hym083s3zt6oe1byyapxu0ap5xzhom37.png)|

## Examples that provide visualizations<a name='visualizations'></a>

Other commands will provide you with a graphical view by default (in
most cases, you can specify `--cli` if you really want to stay in text
mode). You can launch multiple of these graphical windows, and keep
them open to help you with other tasks. Opening a new "windowed"
command takes only a second or so.

<a name="preview"></a><a name="grid"></a>

--------------------------------------------
### Visualizing a composition

```bash
$ kui preview @demos/looper.js
```
![visualization of composition](https://ibm.box.com/shared/static/xantjhxwwm0zmp31kckh8s0fe07gawew.png)

--------------------------------------------
### A grid view of recent activations

```bash
$ kui grid
```
![grid view](https://ibm.box.com/shared/static/kzgsbdeou04twohdlbzp20fsdqhzb334.gif)

--------------------------------------------
### For Compositions, a trace visualization

```bash
$ kui activation logs eda8a..
```
![trace view](https://ibm.box.com/shared/static/1gga6iqforftnn3zdnz3dyj4875cp539.png)

--------------------------------------------
### For Cloud Functions, a log viewer

```bash
$ kui activation logs c5dba..
```
![logs view](https://ibm.box.com/shared/static/21668bkuw4925y35tydx7btjq2hor5mn.png)

--------------------------------------------
### A statisitical view of recent invocations

```bash
$ kui table
```
![table view](https://ibm.box.com/shared/static/zisacj7inozq2pamjun3suf8qxi6dvd2.png)

--------------------------------------------
### A temporal view of recent invocations

```bash
$ kui grid --timeline
```
![timeline view](https://ibm.box.com/shared/static/3iuczlken4geeknqkrt0pbrvk2sjlag0.png)
