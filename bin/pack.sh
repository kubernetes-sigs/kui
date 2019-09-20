#!/usr/bin/env bash

if [ ! -d /tmp/kui-packs ]; then
    mkdir /tmp/kui-packs
else
    rm -f /tmp/kui-packs/*
fi

for i in plugins/*; do
    if [ -d $i ]; then
        echo "packing $(basename $i)"
        (cd $i && npm pack >& /dev/null && mv kui-shell*.tgz /tmp/kui-packs) &
    fi
done

for i in packages/*; do
    if [ -d $i ]; then
        echo "packing $(basename $i)"
        (cd $i && npm pack >& /dev/null && mv kui-shell*.tgz /tmp/kui-packs) &
    fi
done

wait

echo "done: packs generated in /tmp/kui-packs"
