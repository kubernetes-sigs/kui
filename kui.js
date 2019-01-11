#!/usr/bin/env node

// get node off the argv
process.argv.shift()

process.env.KUI_HEADLESS = true
process.env.KUI_DEV = true

require('./build/main/main').main(process.argv)
