---
title: Guidebook Playground
layout:
    1: left
    2: 
        position: default
        maximized: true
    3:
        position: default
        maximized: true
---

# Guidebooks: Automatic Wizards from Markdown

A guidebook is a **markdown** file, written with a bit of care so that
it can be automatically processed into a **wizard** experience. The
wizard guides users through a task.

As part of this guidance, the wizard knows how to sequence the
sub-tasks, and when a sub-task cannot proceed until the user makes a
choice.

Some sub-tasks may be expensive or non-indempotent. With a guidebook,
it is possible to validate whether sub-tasks are truly needed for any
given user in their current context; e.g. this laptop versus that
laptop, or this cluster versus that, etc.

## Implementation Details

The [`madwizard`](https://github.com/guidebooks/madwizard) tool can be
used to "vet" that a markdown file is suitable for this kind of
treatment. `madwizard` parses the markdown into various models,
including a wizard model.

What you are seeing here is a UI on top of these models.  These models
can also be run through automated tests, ensuring that your
documentation works, and continues to do so.

---

=== "Choice"
    ```bash
    ---
    execute: now
    maximize: true
    outputOnly: true
    ---
    commentary --send guidebook-playground -f /kui/madwizard/playground/hello.md
    ```

=== "Sequence of Choices"
    ```bash
    ---
    execute: now
    maximize: true
    outputOnly: true
    ---
    commentary --send guidebook-playground -f /kui/madwizard/playground/two-choices.md
    ```

=== "Multi-select"
    ```bash
    ---
    execute: now
    maximize: true
    outputOnly: true
    ---
    commentary --send guidebook-playground -f /kui/madwizard/playground/multi.md
    ```

=== "Form"
    ```bash
    ---
    execute: now
    maximize: true
    outputOnly: true
    ---
    commentary --send guidebook-playground -f /kui/madwizard/playground/form.md
    ```

---

=== "The Resulting Wizard"
    ```bash
    ---
    execute: now
    outputOnly: true
    maximize: true
    ---
    madwizard playground guidebook-playground
    ```
