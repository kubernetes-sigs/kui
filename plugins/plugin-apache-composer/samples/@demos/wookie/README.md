# Composer Wookiechat

This demo queries SWAPI for character information. This project
intercepts the SWAPI results and forwards to STAPI using a Composer
flow that adds a retain and an if-then-else statement.

The actions are:

```
swapi.js: query SWAPI
stapi.js: query STAPI
validate.js: check results from SWAPI
forward.js: forward SWAPI results to user
```

The composition is:

```
app.js : query SWAPI and if result set is empty, query STAPI
```
