---
title: Yoyoyo
layout:
  1: left
---

This should appear in a left split.

- **[Step1](#kui-link-AAA)** _blank_ Desc1
- **[Step 2](#kui-link-BBB)** _blank_ Desc2.
- **Minor step** _minor_ Should render as a minor step.
- **[Step 3](#kui-link-CCC)** _blank_ Desc3.
- **[Step 4](#kui-link-DDD)** _blank_ Desc4.
- **Another minor step** _minor_ Also minor.
- **[Step 5](#kui-link-EEE)** _blank_ Desc5.

---

This should appear in a default split.

```bash
---
id: AAA
---
intentionalerror
```

=== "tab1"

    ```{.bash .no-copy}
    ---
    id: BBB
    ---
    echo BBB
    ```

    ```bash
    ---
    id: CCC
    ---
    echo CCC
    ```

=== "tab2"

    ```bash
    ---
    id: DDD
    ---
    echo DDD
    ```

```bash
---
id: EEE
---
echo EEE
```
