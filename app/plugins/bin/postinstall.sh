#!/usr/bin/env bash

echo "Setting up modules $CLOUDSHELL_INSTALL_UI"

function failfast {
    (cd $1 && npm install)

    if [ $? != 0 ]; then
        exit $?
    fi
}

failfast modules/k8s
failfast modules/openwhisk
failfast modules/apache-composer
failfast modules/grid

for i in modules/*; do
    if [ "$i" != "modules/k8s" ] && [ "$i" != "modules/openwhisk" ] && [ "$i" != "modules/apache-composer" ] && [ "$i" != "modules/grid" ] && [ -f $i/package.json ] && [ ! -f $i/.from_npm ] && { [ ! -f $i/.ui ] || [ -n "$CLOUDSHELL_INSTALL_UI" ]; }; then
        echo "Setting up $i"
        (cd $i && npm install) &
    else
        echo "Skipping $i"
    fi
done

wait
if [ $? != 0 ]; then
    exit $?
fi

# this is not currently used, but we may revisit it, when we use
# plugins/package.json to install modules; hence the exit 0, for now
exit 0
if [ -d node_modules/@kui ]; then
    for i in node_modules/@kui/*; do
        if [ "$i" == "node_modules/@kui/*" ]; then
            break
        fi

        mod="`basename $i`"
        rm -rf "modules/$mod"
        mv $i "modules/$mod"
        echo '*' > "modules/$mod/.gitignore"

        if [ ! -f $i/.ui ] || [ -n "$CLOUDSHELL_INSTALL_UI" ]; then
           touch "modules/$mod/.from_npm"
        fi
    done
fi
