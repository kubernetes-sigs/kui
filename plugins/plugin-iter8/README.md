# Kui Integrated with Iter8

The following Kui plugin provides support for the Iter8 analytics service in creating and managing continuous, online experiments.

## Authors

- [Avery Huang](https://github.com/avhhh)
- [Sushma Ravichandran](https://github.com/sushmarchandran)

## Installation

The following steps builds the plugin directly from the repo.

```sh
$ git clone https://github.com/iter8-tools/iter8-kui.git
$ cd kui/
$ npm ci
```

To run the software, run the following command:

```
$ npm run start
```

## Directory Structure

The source code for the plugin resides in the `plugin-iter8/src/` directory which has specific subdirectories for storing code for specific functionalities. The descriptions for each subdirectory is described below:

| Subdirectory     | Description                                                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------------------------------ |
| controller/      | Code to generate experiment objects, metric configmaps, traffic distribution etc...                                |
| models/          | Code that creates/registers commands                                                                               |
| modes/           | React code that generates the content of the commands registered in the parent directory                           |
| components/      | Code where we use KUI/Kubectl for current context, eg: namespace details, services running, metrics available etc. |
| utility/         | Extra methods used for data preprocessing/processing, API calls, etc                                               |
| web/scss/static/ | custom SCSS files for interface styling                                                                            |
