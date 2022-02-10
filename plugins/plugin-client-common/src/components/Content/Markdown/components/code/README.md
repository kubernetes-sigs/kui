# Markdown Code Block Handling

## Execution Ordering Constraints

- markdown tabs represent an exclusive set of options
  - code blocks within a tab must be executed sequentially
- code blocks within a wizard step can be executed in any order
- across wizard steps, the groups of code blocks in each step must be executed sequentially in the order of the wizard steps

```
  *************
  Wizard Step 1
      CodeA
  *************

  *************
  Wizard Step 2

  |Tab1 | | Tab 2 |
    CodeB   CodeC
            CodeD
            CodeE
  *************

  *************
  Wizard Step 3
      CodeF
  *************
```

Under those rules, a partial ordering of this markdown is:

    CodeA -> CodeB                    -> CodeF
         \-> CodeC -> CodeD -> CodeE  -/
