---
title: Make Your Own Notebook
layout:
  1: left
---

# Authoring Kui Notebooks

Kui interprets and displays markdown source. Kui has special
interpretation for a some of the common bits of markdown syntax,
allowing you to:

- Define [hints](#hints), using markdown blockquotes
- Define [executable code blocks](#executable-code-blocks) that
  provide sample output, and let the user re-execute the code in their
  context
- Define a [Progress Step Lists](#progress-step-lists), that helps
  guide the user through a list of code executions
- [Set a title](#setting-a-title) for your notebook
- Define the [_split layout_](#creating-a-split-layout) for your
  notebook

---

## Hints

When Kui encounters a `>` that block quotes a region of text, Kui will
render this using a callout. For example:

> This is a hint!

## Executable Code Blocks

To make a code block executable, make sure to specify a language of
either `bash`, `sh`, or `shell`.

Inside a code blocks, you may define metadata:

```bashy
---
id: my-first-command
response: hello
---
echo hello
```

<!-- Hello viewers of the source to this notebook! Note that we have
used a language of `bashy` here, to prevent Kui from rendering this as
an executable code block. -->

When given one of those executable languages (e.g. if your code block
starts with \`\`\`bash), Kui will display this as a _executable_ code
block with the given sample output. Here is that same text, but now
repeated as a normal code block:

```bash
---
id: my-first-command
response: hello
---
echo hello
```

And another example:

```bash
---
id: my-second-command
response: world
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

## Setting a Title

In your markdown source, add this to the _frontmatter_, at the top. If
you already have frontmatter, add only the `title:` line.

```yaml
---
title: My title
---

```

## Creating a Split Layout

In your markdown source, use section breaks `---` to mark the
boundaries between splits. Then, define a `layout` structure in your
frontmatter, which maps section indices (starting from 1) to the
desired split location. For example:

```yaml
---
layout:
  1: left
  2: bottom
---

```
