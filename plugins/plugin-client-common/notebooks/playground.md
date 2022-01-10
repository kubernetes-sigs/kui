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

=== "Hints"
    ```bash
    ---
    execute: now
    maximize: true
    outputOnly: true
    ---
    commentary --send playground -f /kui/hints.md
    ```

=== "Expandable Section"
    ```bash
    ---
    execute: now
    maximize: true
    outputOnly: true
    ---
    commentary --send playground -f /kui/expandable-section.md
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

=== "Code Blocks"
    ```bash
    ---
    execute: now
    maximize: true
    outputOnly: true
    ---
    commentary --send playground -f /kui/code-blocks.md
    ```


---

```bash
---
execute: now
outputOnly: true
---
commentary --receive playground
```

