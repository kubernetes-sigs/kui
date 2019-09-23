# Creating a Kui Headless Build

Please note: the scripts in this directory are not intended for direct
consumption. Please consult the [custom client
guide](../../../../docs/dev/custom-clients.md) for more information on
developing and building a custom Kui client.

This directory helps with creating an headless build of Kui.

## Internal Informnation on the build process

The [build.sh](./build.sh) script (again: not intended for direct use,
see above) will generate the platform distribution targets. For
clients developed within the Kui monorepo, your interface to this
script is `npm run build:headless`. For clients developed as external
repositories, your interface to it will be `npx kui-build-headless`;
please see the [custom client
guide](../../../../docs/dev/custom-clients.md) for more information on
these alternatives.
