# webpack builds

This directory will help you to create and publish a webpack
distribution. The intention is for creating a hosted version of Kui,
for use within any reasonably compliant browser.

## Building for webpack

This command will generate the webpack bundles. 

```bash
npm run webpack
```

When it is done, you should see `*.br` files generated in the enclosed
`build/` directory. These are the javascript bundles, compressed using
the [brotli](https://en.wikipedia.org/wiki/Brotli) encoding. Brotli
provides fast decompression combined with higher compression ratios
than most other approaches out there.

## Serving Locally

To test the webpack builds, you may choose to run a local web
server. The only requirements on this server are: CORS and Brotli
support (the latter is mostly a pass-through as far as the server is
concerned). You can use the `http-server` npm for these purposes, by
issuing:

```bash
npm run http
```

The first time you execute this command, you will be prompted to
generate a self-signed certificate. When the http-server process is
ready, you will see a URL to visit.

### Configuring the local webpack environment

To change the build settings for a local build, consult
[webpack-local.json](../../app/config/envs/webpack-local.json).


## Server from S3

You may also serve Kui directly (in a serverless fashion) from an S3
bucket.  The `publish.sh` script included in this directory will
deploy the webpack build to an S3 bucket. It can hosted off any
S3-compliant service. The script uses the `ibm-cos-sdk` npm SDK to
help with the publication step, but this SDK only requires the
published S3 API. You should have your S3 secrets either in an
environment variable `COS_SECRETS`, or stashed in a file (which is
gitignored) `../publishers/s3/secrets-cos.json`. You will see a
template for the expected schema of this file, in that same directory.

## Configuring an S3 deployment

To change the build settings for an S3 deployment, consult
[webpack.json](../../app/config/envs/webpack.json).
