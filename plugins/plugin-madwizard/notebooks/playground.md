---
title: Guidebook Playground
layout:
    1: 
        position: default
        maximized: true
    2:
        position: default
        maximized: true
---

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

=== "Graphical Wizard"
    ```bash
    ---
    execute: now
    outputOnly: true
    maximize: true
    ---
    madwizard playground guidebook-playground
    ```

=== "Textual Wizard"
    ```bash
    ---
    execute: now
    outputOnly: true
    maximize: true
    ---
    madwizard playground guidebook-playground --ui=text
    ```
