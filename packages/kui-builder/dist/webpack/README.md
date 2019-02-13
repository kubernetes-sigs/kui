# Serving Kui to Browsers via webpack

Please note: the scripts in this directory are not intended for direct
consumption. Please consult the [custom client
guide](../../../../docs/dev/custom-clients.md) for more information on
developing and building a custom Kui client.

The rest of this file is intended to describe the general concepts of
[webpack](https://webpack.js.org/), and its relation to Kui.  The
intention is for creating a hosted version of Kui to be served to web
browsers; this in contrast to the [Kui Electron](../electron)
distributions which are intended to be run locally from a
double-clickable application.

The core views of Kui, and the plugins shipped with this repository
are currently compatible with any reasonably compliant browser.

## webpack bundles

The [build.sh](./build.sh) script (again: not intended for direct use,
see above) will generate the webpack bundles. For clients developed
within the Kui monorepo, your interface to this script is `npm run
build:webpack`. For clients developed as external repositories, your
interface to it will be `npx kui-build-webpack`; please see the
[custom client guide](../../../../docs/dev/custom-clients.md) for more
information on these alternatives.

When the build is done (which may take 2-3 minutes), you should see a
collection of `*.br` files generated in your `my-client/dist/webpack`
directory. These are the webpack bundles, compressed using the
[brotli](https://en.wikipedia.org/wiki/Brotli) encoding. Brotli
provides fast decompression combined with generally much higher
compression ratios than gzip.

### Warning on https verus brotli

Be warned that the [brotli plugin for
nginx](https://github.com/google/ngx_brotli) requires the use of
https. This is why, in the docker build [described
below](#how-to-serve-the-webpack-assets), you will see the use of
self-signed certificates. If you use the [Kui
Proxy](#notes-on-the-kui-proxy), it must also be served over https.

## Notes on The Kui Proxy

It is likely that your browser deployment will not have direct API
access to the backend API servers. This could be due to CORS
limitations, for example. To support this use case, Kui includes a
proxy server. Consult [the proxy
documentation](../../../proxy/README.md) to learn more about setting
it up. Without the proxy in place, the Kubernetes and OpenWhisk
plugins will likely not be functional when serving Kui from a browser.

## How to serve the webpack assets

When the build process completes, you will also have a docker image
`kui-webpack` that can serve up your custom client. This docker image
includes `nginx`, the `brotli` plugin for nginx, along with the
webpack bundles and other HTML assets that constitute your Kui client.

To run it from your custom client directory:

```bash
npx kui-run-webpack
```

This npm script makes sure that the self-signed SSL certificates have
been created, and then does something along the lines of `docker run
--rm -p 9080:443 kui-webpack`

Once the local server is up, you may visit https://localhost:9080/ to
use the webpack client.

### Warning about self-signed certificates

This example docker image uses self-signed certificates.  Therefore,
the first time you execute this command, you will be prompted to
generate a self-signed certificate. When the http-server process is
ready, you will see a URL to visit.

## Serving from S3

You may also serve Kui directly (in a serverless fashion) from an S3
bucket.  The `publish.sh` script included in this directory will
deploy the webpack build to an S3 bucket. It can hosted off any
S3-compliant service. The script uses the `ibm-cos-sdk` npm SDK to
help with the publication step, but this SDK only requires the
published S3 API. You should have your S3 secrets either in an
environment variable `COS_SECRETS`, or stashed in a file (which is
gitignored) `../publishers/s3/secrets-cos.json`. You will see a
[template](../publishers/s3/secrets-cos-template.json) for the
expected schema of this file, in that same directory.

### Configuring an S3 deployment

To change the build settings for an S3 deployment, consult
[webpack.json](../../app/config/envs/webpack.json).
