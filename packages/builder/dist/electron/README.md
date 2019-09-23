# Creating Double-clickables via Electron

Please note: the scripts in this directory are not intended for direct
consumption. Please consult the [custom client
guide](../../../../docs/dev/custom-clients.md) for more information on
developing and building a custom Kui client.

This directory hosts the utilities necessary to create Electron
double-clickable platform distributions.

## Platform Targets

Kui uses [electron-packager]() and related tools to create Electron
distributions. This packaging tools support a variety of platform
targets. Kui currently focuses on the following:

- a Windows zip file that includes the double-clickable
  application. The Electron packaging toolset also supports MSI and
  Windows Store targets; PRs are welcome to add such support to Kui.

- a Linux zip file and .deb; PRs are welcome to add support for the
  existing .rpm build target.

- a MacOS tar.bz2 and .dmg; PRs are welcome to add support for the
  Apple App Store build target.

## Internal Informnation on the build process

The [build.sh](./build.sh) script (again: not intended for direct use,
see above) will generate the platform distribution targets. For
clients developed within the Kui monorepo, your interface to this
script is `npm run build:electron`. For clients developed as external
repositories, your interface to it will be `npx kui-build-electron`;
please see the [custom client
guide](../../../../docs/dev/custom-clients.md) for more information on
these alternatives.
