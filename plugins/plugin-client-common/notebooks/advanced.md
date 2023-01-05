# Advanced Topics

## Set a Page Title

In your markdown source, add this to the _frontmatter_, at the top. If
you already have frontmatter, add only the `title:` line.

```yaml
---
title: My title
---

```

## Create a Split Layout

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
