# webpack builds

This directory will help you to create and publish a
[webpack](https://webpack.js.org/) distribution. The intention is for
creating a hosted version of Kui, for use within any reasonably
compliant browser.

## Building for webpack

This command will generate the webpack bundles:

```bash
npm install
./build.sh
```

When it is done (which may take 2-3 minutes), you should see a
collection of `*.br` files generated in the enclosed `build/`
directory. These are the webpack bundles.

The bundles are compressed using the
[brotli](https://en.wikipedia.org/wiki/Brotli) encoding. Brotli
provides fast decompression combined with higher compression ratios
than most other approaches out there.

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

After `build.sh` is done, you may choose to build a docker image that
will serve up the webpack assets. This is helpful for test and
debugging, and may also be helpful as a template for real
deployments. First, build the docker image:

```bash
./build-docker.sh
```

This will create a docker image named `kui-webpack`. To run it:

```bash
npm run http
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

### Configuring the local webpack environment

To change the build settings for a local build, consult
[webpack.json](../../app/config/envs/webpack.json).

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
