# Executable Code Blocks

To make a code block executable, make sure to specify a language of
either `bash`, `sh`, or `shell`.

Inside a code blocks, you may define metadata, such as an identifier
when linking code blocks into [Progress Step
Lists](#progress-step-lists).

```bashy
echo hello
```

<!-- Hello viewers of the source to this guidebook! Note that we have
used a language of `bashy` here, to prevent Kui from rendering this as
an executable code block. -->

When given one of those executable languages (e.g. if your code block
starts with \`\`\`bash), Kui will display this as a _executable_ code
block with the given sample output. Here is that same text, but now
repeated as a normal code block:

```bash
---
id: my-first-command
---
echo hello
```

And another example:

```bash
---
id: my-second-command
---
echo world
```

The `id` part is used to help you define a "progress stepper"
list. When a referenced code block is executed, the progress stepper
will update to show the user the status of that code blocks'
execution.

## Progress Step Lists

When using this syntax for lists:

```
- **[Step 1](#kui-link-my-first-command)** *blank* This should echo hello.
- **[Step 2](#kui-link-my-second-command)** *blank* This should echo world.
```

you will get a progress step list like this:

- **[Step 1](#kui-link-my-first-command)** _blank_ This should echo hello.
- **[Step 2](#kui-link-my-second-command)** _blank_ This should echo world.

Note the use of the `my-first-command` and `my-second-command`
cross-reference identifiers.
