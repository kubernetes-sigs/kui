# Architecture of Kui VFS

The architecture has this stack:

```
--------------------
 Client Controller    e.g. a command registration for /mkdir
--------------------
  VFS Delegation      dispatch filepaths to the owning VFS impl
--------------------
    VFS Impls         e.g. interpret mkdir against local filesystem
--------------------
 Server Controller    implement portions that cannot be run in a browser
 -------------------
```

Thus, to add a new VFS API, you must currently add a controller (if
one does not already exist) for the command, code the delegation that
knows which positional parameters correspond to filepaths, implement
the client-side and any needed server-side portions of the VFS impl.

## VFS Interface

The interface consists

- cd, ls, mkdir, etc.

## Client Controllers

- e.g. /mkdir -> which invokes the next layer: Delegates

## VFS Delegation

These resolve filepaths to VFS impl.

```
mkdir /a/b/c
      ^^^^ -> VFS Impl lookup based on path
```

Then call `impl.mkdir(args)`.

## VFS Impls (running on Client)

- These can't assume they are running on the Kui proxy side
- Examples
  - local.ts for local filesystem

## Server-side support

If a client VFS impl requires execution of code that cannot safely run
in a browser, it must manage routing this code to the Kui proxy. For
example:

- `vfs _ls` for `ls` (because we handle ls without a pty, so ls needs its own server-side handler)
- `sendtopty` for`mkdir`, and most everything else

### Server-side controllers

These are command handlers that facilitate the server-side of the browser-unsafe logic.

- `/vfs/_ls` handler
- or generic `pty` handling for mkdir
