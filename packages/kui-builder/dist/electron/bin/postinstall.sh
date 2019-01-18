#!/usr/bin/env bash

# this installs some helpers for cross-building linux and windows
# electron distributions from a macOS host
if [[ `uname` == Darwin ]]; then
    # for mac, we need gtar
    which gtar
    if [ $? != 0 ]; then
        brew install gtar
    fi

    # needed for windows builds
    brew list | grep '^mono$'
    if [ $? == 1 ]; then
        brew install mono
    fi

    # needed for linux builds
    brew list | grep '^dpkg$'
    if [ $? == 1 ]; then
        brew install dpkg
    fi

    # also needed for linux builds
    brew list | grep '^fakeroot$'
    if [ $? == 1 ]; then
        brew install fakeroot
    fi
fi
