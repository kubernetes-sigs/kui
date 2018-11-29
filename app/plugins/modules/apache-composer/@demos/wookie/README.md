# Composer Wookiechat
This is sample that extends a subset of [wookiechat](https://github.ibm.com/building61-hackers/wookiechat/wiki/Wookieechat) to allow querying additional APIs.

The original wookiechat queries SWAPI for character information, then moves to Watson Discovery if the result set is empty.  This project intercepts the SWAPI results and forwards to STAPI using a Composer flow that adds a retain and an if-then-else statement.

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
