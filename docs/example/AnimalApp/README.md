# AnimalApp

This is a demo web application that uses Kui as a framework for
developing a hosted visual terminal.

## Usage

**WARNING**: try to avoid executing these commands after having done
an `npm ci` at the top-level of your Kui clone. Nothing will break,
but webpack will bundle much more than it has, and may run out of
memory. This directory is intended for you to copy out and start your
own repository, external to Kui itself. Note how the package.json
references versions of Kui packages that have been published to npm;
i.e. this repository points to the latest stable version of Kui, and
does not use any bits from the master branch, or whatever branch of
Kui you may have cloned to acquire this source. At some point, we will
extract this directory so that it sits in a separate repo. For now,
please heed these warnings. Thanks!

```sh
npm ci
npm start
```

## Introduction

This [wiki](https://github.com/IBM/kui/wiki) introduces the ways in
which this application enhances Kui:

- [Homepage](https://github.com/IBM/kui/wiki#approaches-for-enhancing-kui) uses these [commands](https://github.com/IBM/kui/tree/master/docs/example/AnimalApp/plugins/plugin-example/src/commands) to give contributors a quick look of how to enhance kui by commands and built-in views, and uses this [status stripe widget](https://github.com/IBM/kui/tree/master/docs/example/AnimalApp/plugins/plugin-example/src/view/CatDogWidget.tsx) to show how to enhance Kui by custom view.

- [Kui Command Documentation](https://github.com/IBM/kui/wiki/1.-Commands) and [Terminal View Documentation](https://github.com/IBM/kui/wiki/2a.-Terminal-View) uses the [string](https://github.com/IBM/kui/tree/master/docs/example/AnimalApp/plugins/plugin-example/src/view/string), [boolean](https://github.com/IBM/kui/tree/master/docs/example/AnimalApp/plugins/plugin-example/src/view/boolean), and [table](https://github.com/IBM/kui/tree/master/docs/example/AnimalApp/plugins/plugin-example/src/view/table) view as examples of Terminal-oriented command response.

- [TopNavSidecar View Documentation](https://github.com/IBM/kui/wiki/2b.-TopNavSidecar-View) uses [this](https://github.com/IBM/kui/tree/master/docs/example/AnimalApp/plugins/plugin-example/src/view/mmr-example.ts) as an example of TopNavSidecar-oriented command response.

- [LeftNavSidecar View Documentation](https://github.com/IBM/kui/wiki/2c.-LeftNavSidecar-View) uses [this](https://github.com/IBM/kui/tree/master/docs/example/AnimalApp/plugins/plugin-example/src/view/nav-example.ts) as an example of LeftNavSidecar-oriented command response.
