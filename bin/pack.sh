#!/usr/bin/env bash

if [ ! -d /tmp/kui-packs ]; then
    mkdir /tmp/kui-packs
else
    rm -f /tmp/kui-packs/*
fi

for i in plugins/*; do
    if [ -d $i ]; then
        echo "$(tput setaf 8)packing $(basename $i)$(tput sgr0)"
        (cd $i && npm pack >& /dev/null && mv kui-shell*.tgz /tmp/kui-packs) &
    fi
done

for i in packages/*; do
    if [ -d $i ]; then
        echo "$(tput setaf 8)packing $(basename $i)$(tput sgr0)"
        (cd $i && npm pack >& /dev/null && mv kui-shell*.tgz /tmp/kui-packs) &
    fi
done

wait

for i in /tmp/kui-packs/*.tgz; do
    mv $i ${i//-[[:digit:]].[[:digit:]].[[:digit:]]}
done

echo "$(tput setaf 2)done:$(tput sgr0) packs generated in /tmp/kui-packs"
