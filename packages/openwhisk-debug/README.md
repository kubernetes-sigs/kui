# OpenWhisk Debug
An IBM Cloud Functions Shell plugin that lets users run and debug
actions in a local docker container. It requires Docker to be
pre-installed to your machine.

## Install

First, make sure you have Docker installed on your development machine.

```
$ docker 

Usage:	docker COMMAND
```

Now launch the graphical shell and execute the `local` command to see
usage.

The first time you invoke a command, the plugin wil download the
Docker image for your action runtime for the first time you use
it. This takes about 20 seconds but is a one-time thing.

The plugin will start a container when it is first called, and close
that container when you close Shell.

This means that if you are using `local play/debug` from the terminal
(headless mode), the container will be created when the Shell app
window appears and removed when the Shell app window is
closed. Starting a container takes time. You can avoid this by calling
`local play/debug` from the terminal for the first time and keep that
Shell app window opened and enter more `local` commands in there.


## Commands

### local debug (currently nodejs only)

Run an action or activation in a local docker container, and open
Chrome DevTool in the sidecar for live debugging. Provide input with
`-p`. Return the output data.

```
local debug action_name_or_activation_id [-p name value]
```

### local play

Run an action or activation in a local docker container. Provide input
with `-p`. Return the output data and execution time. This feature is
useful to test how long your action runs in a docker container
vs. openwhisk.

```
local play action_name_or_activation_id [-p name value]
```


## Troubleshooting 

If you see an error like

```
Error: (HTTP code 500) server error - driver failed programming external connectivity on endpoint shell-local (21466e1d857f1d1132266a786a1498c0a5cab73a6843f7578faeb9a336451d2b): Bind for 0.0.0.0:8080 failed: port is already allocated 
```

This is becuase some other programs occupy the ports that Shell's
docker container is trying to use (port 8080 for sending docker API,
and port 5858 for connecting to the debugger). To solve this, first
try

```
docker ps -a 
```

from the terminal. If you see a container that is using port
0.0.0.0:8080 and/or port 0.0.0.0:5858, close that container using
`docker kill containerName` and `docker rm containerName`. Then
restart Shell and run `local debug` or `local play` again.

If the error still exists, use 

```
lsof -i -P -n | grep LISTEN 
```

to see who are using the ports, and close them. 

## Current limitations 

 - `local debug` only works for nodejs actions. 

 - The plugin cannot debug/play a sequence; you can select child action
activations and debug/play them one by one.

 - The port numbers our Shell docker container uses are fixed (8080
and 5858). I might extend the plugin to allow specifying custom ports.

