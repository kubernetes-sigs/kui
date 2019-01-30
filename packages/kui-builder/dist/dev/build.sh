#!/usr/bin/env bash

SCRIPTDIR=$(cd $(dirname "$0") && pwd)
TOPDIR="${SCRIPTDIR}/../../../../"
STAGING="${TOPDIR}"/packages/app/content

KUI_BUILD_CONFIG=${KUI_BUILD_CONFIG-"$SCRIPTDIR"/../../examples/build-configs/default}
if [ -d "$KUI_BUILD_CONFIG"/css/themes ]; then
    echo "linking in theme css"
    rm -f "$STAGING"/css/themes && \
        (cd "$STAGING"/css && ln -s "$KUI_BUILD_CONFIG"/css/themes)
fi
exit
if [ -d "$KUI_BUILD_CONFIG"/icons ]; then
    echo "copying in theme icons"
    rm -f "$STAGING"/icons && \
        (cd "$STAGING" && ln -s "$KUI_BUILD_CONFIG"/icons)
fi
if [ -d "$KUI_BUILD_CONFIG"/images ]; then
    echo "copying in theme images"
    rm -f "$STAGING"/images && \
        (cd "$STAGING"packages/app/content/css && ln -s "$KUI_BUILD_CONFIG"/images)
fi
