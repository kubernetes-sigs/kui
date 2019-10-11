#!/usr/bin/env bash

rm -rf /tmp/kui-packs && mkdir /tmp/kui-packs

for i in plugins/*; do
    if [ -d $i ]; then
        echo "$(tput setaf 8)packing $(basename $i)$(tput sgr0)"
        (cd $i && npm pack > /dev/null 2>> /tmp/kui-packs.err && mv kui-shell*.tgz /tmp/kui-packs) &
    fi
done

for i in packages/*; do
    if [ -d $i ]; then
        echo "$(tput setaf 8)packing $(basename $i)$(tput sgr0)"
        (cd $i && npm pack > /dev/null 2>> /tmp/kui-packs.err && mv kui-shell*.tgz /tmp/kui-packs) &
    fi
done

wait
CODE=$?

if [ $CODE != 0 ]; then
    echo "Error generating packs. You will find the error logs in /tmp/kui-packs.err"
    if [ -n "$TRAVIS_JOB_ID" ]; then
        cat /tmp/kui-packs.err
    fi
fi

if [ -n "$TRAVIS_JOB_ID" ]; then
    echo "Generated these packs:"
    ls -l /tmp/kui-packs/
fi

for i in /tmp/kui-packs/*.tgz; do
    mv $i ${i//-[[:digit:]].[[:digit:]].[[:digit:]]}
done

echo "$(tput setaf 2)done:$(tput sgr0) packs generated in /tmp/kui-packs"

exit $CODE
