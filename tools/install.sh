#! /bin/bash

# Usage: curl -sL https://raw.githubusercontent.com/IBM/kui/master/tools/install.sh | sh
# TODO: Eventually -> curl -sL https://install.kui-shell.org | sh

echo ""
echo "|----- Kui, the hybrid command-line/GUI Kubernetes tool -----|"

echo ""
echo "Some commands need \"sudo\", so your pass could be asked"
echo ""

caution() {
  echo ""
  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  echo "Please, back up your custom plugins, actual files will be removed"
  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  echo ""
  read -p "Press enter to continue"
  echo ""
}

OS="`uname`"

case $OS in

  'Linux')
    echo "Linux detected"

    BIN_DIR="/opt"
    BIN_LINK="/usr/local/bin/kui"

    echo ""
    echo "Installing in \"$BIN_DIR\""
    echo "Linking \"$BIN_LINK\""
    echo ""

    if [ -f $BIN_LINK ]; then
      caution
    fi

    curl -L -o ./kui.zip https://linux-zip.kui-shell.org
    unzip kui.zip
    rm kui.zip
    sudo rm -rf $BIN_DIR/Kui-linux-x64
    sudo mv Kui-linux-x64 $BIN_DIR
    sudo ln -sf $BIN_DIR/Kui-linux-x64/Kui $BIN_LINK
 
    echo ""
    echo "|----- Type \"kui\" to start! -----|"
    ;;

  # TODO:
  # 'WindowsNT')
  #   echo "Windows detected"
  #   ;;

  'Darwin')
    echo "Mac OS X detected"

    BIN_DIR="/Applications"

    echo ""
    echo "Installing in $BIN_DIR"
    echo ""

    if [ -d "$BIN_DIR/Kui.app" ]; then
      caution
    fi

    curl -L -o ./kui.tar.bz2 https://macos-tarball.kui-shell.org
    tar xjvf kui.tar.bz2
    rm kui.tar.bz2
    sudo rm -rf $BIN_DIR/Kui.app
    sudo mv Kui-darwin-x64/Kui.app $BIN_DIR
    sudo rm -rf Kui-darwin-x64
 
    echo ""
    echo "|----- You can find \"Kui\" in your \"$BIN_DIR\" folder :) -----|"
 
    open -a Kui
    ;;
  *)
    echo "Not supported platform :("
    ;;
esac
