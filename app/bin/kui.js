#!/usr/bin/env node

// get node off the argv
process.argv.shift()

process.env.KUI_HEADLESS = true

require('../build/main/main')
