# IBMCloud CLI Plugin for Kui

## Getting Started

You firstly need [Go](http://www.golang.org) installed on your
machine. Next, pull in the required dependencies:

```bash
$ go get
```

and then run tests:

```bash
$ go test ./...
```

## Build and run plugin

Download and install the Bluemix CLI. See instructions [here](https://clis.ng.bluemix.net).

Compile the plugin source code with `go build` command, for example

```bash
$ go build
```

Install the plugin:

```bash
$ ibmcloud plugin install ./kui
```

## Use the plugin

For example:

```bash
ibmcloud kui kubectl get pods
```
