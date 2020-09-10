#!/usr/bin/env bash

# see https://github.com/IBM/kui/issues/5608
if grep --include '*.ts' --color=never -r Common.oops plugins/*/src/test | grep --color=never await  | grep --color=never -v err ; then
    echo "BAD TESTS: Some test error handlers will not fail"
    exit 1
else
    exit 0
fi
