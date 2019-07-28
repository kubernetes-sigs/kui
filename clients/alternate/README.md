# Alternate Kui Client

This directory defines an alternate theme for Kui. See the [enclosing
README](../README.md) for more information.

To experiment with this as a webpack client, issue these from the
top-level directory:

```bash
WEBPACK=true npm install
CLIENT=alternate npm run watch:webpack
```

The first command you need only issue once. By default, the top-level
`npm install` does not provision the webpack component; the first
command makes sure to do so.
