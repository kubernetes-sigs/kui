---
title: Dashboard
layout:
    1: default
    2: default
    3: default
    4:
        position: default
        placeholder: Click on entries in the tables, and output will show up here
---

```bash
---
execute: now
watch: /kubectl/config/change
---
k get deploy --watch
```

---

```bash
---
execute: now
watch: /kubectl/context/change
---
k get pods --watch
```

---

```bash
---
execute: now
watch: /kubectl/config/change
---
k get events --sort-by='{.metadata.creationTimestamp}' --watch
```

---

