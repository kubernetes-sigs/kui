#!/usr/bin/env bash

T=$(mktemp)

node -e 'console.log(require("fs").readFileSync("node_modules/carbon-components-react/es/components/Tabs/Tabs.js").toString().replace(/_tab\$tabAnchor\.scrollIntoView\(false\)/, "_tab$tabAnchor.scrollIntoViewIfNeeded ? _tab$tabAnchor.scrollIntoViewIfNeeded() : _tab$tabAnchor.scrollIntoView(false)"))' > "$T"

mv "$T" node_modules/carbon-components-react/es/components/Tabs/Tabs.js
