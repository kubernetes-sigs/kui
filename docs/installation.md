# Installion Guide

This page will help you installing and configuring the Kui Shell.

| Download Method | Command  |
| --------------  | -------- |
| tarball         | `curl -sL https://tarball.kui-shell.org \| tar jxf -` |
| zip             | `curl -sL https://zip.kui-shell.org -o kui.zip` |

To verify your installation:

```bash
$ ./kui/bin/kui version
```

## Setting up Kubernetes Authorization

If you have a KUBECONFIG environment variable defined in your
terminal, Kui will pick that up and run with it. In a browser context,
you can use the command `k8s auth add` command to inject your
configuration YAML and PEM into the browser local storage.

## Setting up OpenWhisk Authorization

If you are currently a user of OpenWhisk, then your `.wskprops` file
is sufficient to get you started; you may skip over this section. If
you have *not* yet configured your local environment for use with
OpenWhisk, then continue reading.

### Getting an Authorization Key for IBM Cloud

In order to acquire the necessary authorization key, first ensure that
you have
[installed the `ibmcloud` tool](https://console.bluemix.net/docs/cli/index.html#overview);
the older `bluemix/bx` tool will also suffice for this purpose. Then:

```
ibmcloud target --cf
ibmcloud plugin install cloud-functions
ibmcloud wsk list
```

## Next Steps

- Return to the [README](../README.md)
