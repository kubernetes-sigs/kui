---
title: What is a Guidebook?
layout:
    1: left
    2: 
        position: default
        maximized: true
---

# An Introduction to Guidebooks

Welcome to the world of guidebooks. A guidebook is a **markdown**
file, written with a bit of care so that it can be automatically
processed into a **wizard** experience. The wizard guides users
through the task.

As part of this guidance, the wizard knows how to sequence the
sub-tasks, and when a sub-task cannot proceed until the user makes a
choice.

Some sub-tasks may be expensive or non-indempotent. With a guidebook,
it is possible to validate whether sub-tasks are truly needed for any
given user in their current context (this laptop versus that laptop;
this cluster versus that, etc.).

## Madwizard

The [madwizard](https://github.com/guidebooks/madwizard) tool can be
used to "vet" that a markdown file is suitable for this kind of
treatment. It also can parse the markdown into various models,
including a wizard model. Kui then has a UI on top of these models.

With this approach, the documentation can also be run through
automated tests, ensuring that it works, and continues to do so.

---

```shell
---
execute: now
maximize: true
outputOnly: true
---
madwizard guide demo
```
