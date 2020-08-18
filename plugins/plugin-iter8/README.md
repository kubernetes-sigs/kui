# Kui Integrated with Iter8

The following Kui plugin provides support for the Iter8 analytics service in creating and managing continuous, online experiments.

## Authors

- [Avery Huang](https://github.com/avhhh)
- [Sushma Ravichandran](https://github.com/sushmarchandran)
- [Alan Cha](https://github.com/Alan-Cha)

## Installation

The following steps builds the plugin directly from the repository.

```sh
$ git clone <repository-url>
$ cd <repository-name>/
$ npm ci
```

To run Kui, run the following command:

```sh
$ npm run start
```

## Directory Structure

The source code for the iter8 plugin resides in the `plugin-iter8/src/` directory which has specific subdirectories for storing code for specific functionalities. The descriptions for each subdirectory is described below:

| Subdirectory     | Description                                                                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| components/      | Code where which uses Kubectl/Env and env commands to get current context, eg: namespace details, services running, metrics available etc. |
| models/          | Code that creates/registers commands                                                                                                       |
| modes/           | React code that generates the content of the commands registered in the parent directory                                                   |
| utility/         | Extra methods used for data preprocessing/processing, API calls, etc                                                                       |
| web/scss/static/ | custom SCSS files for interface styling                                                                                                    |
| test/            | Test cases for different iter8 commands styling                                                                                            |
