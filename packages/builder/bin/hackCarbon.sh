#!/usr/bin/env bash

#
# Temporary hack workaround for https://github.com/IBM/kui/issues/6014
#
# Summary: upstream bug in carbon-components-react that causes
# undesirable scrolling behavior when switching inline sidecar tabs.
#
# Future readers: please get rid of this hack, once the upstream
# carbon bug fix has been released; hopefully that will happen in
# carbon-components-react 7.23.x. As of this writing, Kui is on
# 7.22.x: https://github.com/carbon-design-system/carbon/pull/7111
#

T=$(mktemp)

node -e 'console.log(require("fs").readFileSync("node_modules/carbon-components-react/es/components/Tabs/Tabs.js").toString().replace(/_tab\$tabAnchor\.scrollIntoView\(false\)/, "_tab$tabAnchor.scrollIntoViewIfNeeded ? _tab$tabAnchor.scrollIntoViewIfNeeded() : _tab$tabAnchor.scrollIntoView(false)"))' > "$T"

mv "$T" node_modules/carbon-components-react/es/components/Tabs/Tabs.js
