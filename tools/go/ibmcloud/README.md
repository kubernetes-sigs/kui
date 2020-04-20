# IBMCloud CLI Plugin for Kui

## Getting Started

Download and install the Bluemix CLI. See instructions [here](https://clis.ng.bluemix.net).

To build the plugin, you firstly need [Go](http://www.golang.org) (1.12+) installed on your
machine. Next, compile the plugin source code with `go build` command, for example

```bash
$ go build
```

Install the plugin:

```bash
$ ibmcloud plugin install ./kui
```

Use the plugin:

For example:

```bash
ibmcloud kui kubectl get pods
```
