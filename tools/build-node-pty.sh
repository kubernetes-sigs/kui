set -e
set -o pipefail

T=$(mktemp -d)

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
npm install node-pty@0.11.0-beta19
cd node_modules/node-pty

cat > .npmrc <<EOF
runtime=electron
target=18.0.0
build_from_source=true
disturl=https://atom.io/download/electron
EOF

npm run install
rm -f build/Release/*.pdb
gzip -9 build/Release/*

if [ "$1" = "install" ]; then
    cp build/Release/*.gz "$TARGET"
else
    tar -C build/Release -zcf /tmp/node-pty.tar.gz .
    echo "Built /tmp/node-pty.tar.gz"
fi
