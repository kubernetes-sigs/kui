#!/usr/bin/env bash

echo "Setting up modules $CLOUDSHELL_INSTALL_UI"

(cd modules/k8s && npm install)
(cd modules/openwhisk && npm install)
(cd modules/grid && npm install)

for i in modules/*; do
    if [ "$i" != "modules/k8s" ] && [ "$i" != "modules/openwhisk" ] && [ "$i" != "modules/grid" ] && [ -f $i/package.json ] && [ ! -f $i/.from_npm ] && { [ ! -f $i/.ui ] || [ -n "$CLOUDSHELL_INSTALL_UI" ]; }; then
        echo "Setting up $i"
        (cd $i && npm install) &
    else
        echo "Skipping $i"
    fi
done
wait

if [ -d node_modules/@shell ]; then
    for i in node_modules/@shell/*; do
        if [ "$i" == "node_modules/@shell/*" ]; then
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
