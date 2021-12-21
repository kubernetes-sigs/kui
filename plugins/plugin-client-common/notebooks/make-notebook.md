---
title: Make Your Own Notebook
layout:
  1: left
---

# Authoring Kui Notebooks

Kui interprets and displays markdown source. Kui has special
interpretation for a some of the common bits of markdown syntax,
allowing you to author:

- [Hints](#hints), using markdown blockquotes
- [Expandable Sections](#expandable-sections), using syntax adopted
  from [pymdown's Details
  extension](https://facelessuser.github.io/pymdown-extensions/extensions/details/)
- [Tabs](#tabs), using syntax adopted from [pymdown's Tabbed
  extension](https://facelessuser.github.io/pymdown-extensions/extensions/tabbed/)
- [Executable code blocks](#executable-code-blocks) that
  provide sample output, and let the user re-execute the code in their
  context
- [Progress Step Lists](#progress-step-lists), that helps
  guide the user through a list of code executions
  
In addition, you can define the metadata and structure of your
notebook:

- [Set a title](#setting-a-title) for your notebook
- Define the [_split layout_](#creating-a-split-layout) for your
  notebook

---

## Hints

When Kui encounters a `>` that block quotes a region of text, Kui will
render this using a callout. For example:

> This is a hint!
> - It can have fancy rendering inside.

## Expandable Sections

Sections starting with a `??? tip "Section name"` will be rendered as
an expandable section, with the tab content indented by at least 4
spaces. When using `???+`, the section will be expanded by default.

??? tip "Example Expandable Section"

    **Warning**: due to the vagaries of the Markdown syntax, make sure to
    have a newline separating the section start and section content.

## Tabs

Sections starting with a `=== "Tab name"` will be rendered as tabs,
with the tab content indented by at least 4 spaces. 

**Warning**: due to the vagaries of the Markdown syntax, make sure to
have a newline separating the tab start and tab content, and also
between tabs.

???+ tip "Tab Example"

    > Note how we are using tabs and hints nested inside of an expandable section!

    === "Output"
        
        === "Tab 1"
    
            Markdown **content**.

            Multiple paragraphs.

        === "Tab 2"

            More Markdown **content**.

            - list item a
            - list item b

    === "Markdown"

        ```
        === "Tab 1"

            Markdown **content**.

            Multiple paragraphs.

        === "Tab 2"

            More Markdown **content**.

            - list item a
            - list item b
        ```

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
