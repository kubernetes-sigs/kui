# Kui with Apache OpenWhisk

- [Examples that work well without graphics](#cli-examples)
- [Examples that provide visualizations](#visualizations)

## CLI Examples (those that work well without graphics)<a name='cli-examples'></a>

Some commands work well in textual mode, without any need for
graphical assistance:

| Command           | Functionality         |
| :---------------- | :-------------------- |
| `kui action list` | list deployed actions |

## Examples that provide visualizations<a name='visualizations'></a>

Other commands will provide you with a graphical view by default (in
most cases, you can specify `--cli` if you really want to stay in text
mode). You can launch multiple of these graphical windows, and keep
them open to help you with other tasks. Opening a new "windowed"
command takes only a second or so.

<a name="preview"></a><a name="grid"></a>

---

### A grid view of recent activations

```bash
$ kui grid
```

![grid view](https://ibm.box.com/shared/static/kzgsbdeou04twohdlbzp20fsdqhzb334.gif)

---

### Log viewer

```bash
$ kui activation logs c5dba..
```

![logs view](https://ibm.box.com/shared/static/21668bkuw4925y35tydx7btjq2hor5mn.png)

---

### A statistical view of recent invocations

```bash
$ kui table
```

![table view](https://ibm.box.com/shared/static/zisacj7inozq2pamjun3suf8qxi6dvd2.png)

---

### A temporal view of recent invocations

```bash
$ kui grid --timeline
```

![timeline view](https://ibm.box.com/shared/static/3iuczlken4geeknqkrt0pbrvk2sjlag0.png)

## Next Steps

- [Examples of Kui with Kubernetes](./kubernetes.md)
- [Examples of Kui with Apache Composer](./composer.md)
- Return to the [README](../../../README.md)
