#
# The purpose of this utility is to rebuild the node-pty prebuilt
# modules. By default, it will generate a `/tmp/node-pty.tar.gz` when
# done.
#

set -e
set -o pipefail

T=$(mktemp -d)
T2=$(mktemp -d)

PLATFORM=$(uname | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)
if [ "$ARCH" = "x86_64" ]; then
    ARCH=x64
elif [ "$ARCH" = "aarch64" ]; then
    ARCH=arm64
fi

TARGET="$PWD"/packages/builder/dist/electron/vendor/node-pty/build/$PLATFORM-$ARCH/electron/

cd "$T"
npm init -y
npm install node-pty@0.11.0-beta21 electron@20.1.1 electron-rebuild github:jkleinsc/nan#remove_accessor_signature
npx electron-rebuild -f -w node-pty

cd node_modules/node-pty

if [ -e build/Release/obj.target ]; then
    mv build/Release/obj.target $T2
fi
if [ -e build/Release/.deps ]; then
    mv build/Release/.deps $T2
fi
if [ -e build/Release/.forge-meta ]; then
    mv build/Release/.forge-meta $T2
fi

gzip -9 build/Release/*

if [ "$1" = "install" ]; then
    cp build/Release/*.gz "$TARGET"
else
    tar -C build/Release -zcf /tmp/node-pty.tar.gz .
    echo "Built /tmp/node-pty.tar.gz"
fi
