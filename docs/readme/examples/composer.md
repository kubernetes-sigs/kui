# Kui with Apache Composer

[Composer](https://github.com/apache/incubator-openwhisk-composer/) is
a new programming model for integrating cloud services. With Composer,
you write Javascript or Python code (rather than YAML or JSON) to
synthesize new service offerings from an integration of existing
ones. With its language-oriented approach, Composer allows you use
normal programming idioms, such as if and try/catch, with relatively
minor syntactic variances from the way you would write any normal
program.

Composer is built on [Apache
OpenWhisk](https://github.com/apache/incubator-openwhisk); as such, a
composition of services and cloud functions is itself a cloud
function. This recursive nature of Composer allows for arbitrary and
rich nesting and reuse, as you would get from a normal programming
language.

- [Examples that work well without graphics](#cli-examples)
- [Examples that provide visualizations](#visualizations)

## CLI Examples (those that work well without graphics)<a name='cli-examples'></a>

Some commands work well in textual mode, without any need for
graphical assistance:

| Command                                | Output                                                                                                   |
| :------------------------------------- | :------------------------------------------------------------------------------------------------------- |
| `kui app create hello @demos/hello.js` | ![ok: updated composition hello](https://ibm.box.com/shared/static/6mz8xvdw3wbldh7o111cuu7gnh1kwss4.png) |
| `kui app list`                         | ![hello            composition](https://ibm.box.com/shared/static/w8m0jigs07bv59a7pl3lf3phwj27orwj.png)  |
| `kui app async hello`                  | ![ok: invoked hello with id ...](https://ibm.box.com/shared/static/b646dsiqylqv4b9wom6tj8xquitdkf27.png) |
| `kui session list`                     | ![session list output](https://ibm.box.com/shared/static/hym083s3zt6oe1byyapxu0ap5xzhom37.png)           |

## Examples that provide visualizations<a name='visualizations'></a>

### Visualizing a composition

```bash
$ kui preview @demos/looper.js
```

![visualization of composition](https://ibm.box.com/shared/static/xantjhxwwm0zmp31kckh8s0fe07gawew.png)

### Trace visualization

```bash
$ kui activation logs eda8a..
```

![trace view](https://ibm.box.com/shared/static/1gga6iqforftnn3zdnz3dyj4875cp539.png)

## Next Steps

- [Examples of Kui with Kubernetes](./kubernetes.md)
- [Examples of Kui with Apache OpenWhisk](./openwhisk.md)
- Return to the [README](../../../README.md)
