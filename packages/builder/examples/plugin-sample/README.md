# plugin-sample

To activate this plugin, copy or symlink it so that it is placed in the `plugins/` directory in the top-level.

Then, execute `npm run compile` in the top-level and reload or relaunch your Kui instance.

Try commands: `sample hello`, `sample create action` and `sample sidecar` in your Kui instance.

To test the sample plugin, go the the `tests/` directory, and execute `./bin/corral` to symlink the sample test file, and execute `KEY_FROM_LAYER=false ./bin/runLocal.sh sample`.
