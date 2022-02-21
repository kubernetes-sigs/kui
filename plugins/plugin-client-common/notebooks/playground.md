---
title: Kui Playground
layout:
    1: 
        position: default
        maximized: true
    2: default
---

=== "Hello World"
    ```bash
    ---
    execute: now
    maximize: true
    outputOnly: true
    ---
    commentary --send playground \# Welcome to the Kui Playground :rocket:\n\nAuthor your own Kui Guidebook, using markdown! You can edit this example, using the editor to the left, or explore the other tabs in this playground.
    ```

=== "Code Blocks"
    ```bash
    ---
    execute: now
    maximize: true
    outputOnly: true
    ---
    commentary --send playground -f /kui/code-blocks.md
    ```

=== "Hints"
    ```bash
    ---
    execute: now
    maximize: true
    outputOnly: true
    ---
    commentary --send playground -f /kui/hints.md
    ```

=== "Icons"
    ```bash
    ---
    execute: now
    maximize: true
    outputOnly: true
    ---
    commentary --send playground -f /kui/icons.md
    ```

=== "Tabs"
    ```bash
    ---
    execute: now
    maximize: true
    outputOnly: true
    ---
    commentary --send playground -f /kui/tabs.md
    ```

=== "Tips"
    ```bash
    ---
    execute: now
    maximize: true
    outputOnly: true
    ---
    commentary --send playground -f /kui/expandable-section.md
    ```

=== "Wizards"
    ```bash
    ---
    execute: now
    maximize: true
    outputOnly: true
    ---
    commentary --send playground -f /kui/wizard.md
    ```


---

```bash
---
execute: now
outputOnly: true
---
commentary --receive playground
```

