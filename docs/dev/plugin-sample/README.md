# plugin-sample

To activate this plugin, copy or symlink it so that it is placed in the `plugins/` directory in the top-level.

Then, execute `npm run compile` in the top-level and reload or relaunch your Kui-shell instance.

Try commands: `sample hello`, `sample create action` and `sample sidecar` in your Kui-shell instance.

To test the sample plugin, `(cd tests/; ./bin/corral; KEY_FROM_LAYER=false ./bin/runLocal.sh sample`.
