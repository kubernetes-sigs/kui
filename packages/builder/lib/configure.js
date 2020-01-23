/*
 * Copyright 2018 IBM Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const debug = require('debug')('builder/configure')
const path = require('path')
const fs = require('fs-extra')
const colors = require('colors/safe')

const { moduleExists } = require('./module-exists')
const parseOptions = require('./parse-options')

/**
 * Tell the user where we're at
 *
 */
const task = taskName => console.log(colors.dim('task: ') + taskName)
const info = (key, value) => console.log(colors.blue(`${key}: `) + value)

/**
 * Read in index.html
 *
 */
const readIndex = options =>
  new Promise((resolve, reject) => {
    const { templateDir } = options.build

    debug('read template', templateDir)
    task(`read index.html template from ${templateDir}`)

    fs.readFile(path.join(templateDir, 'index.html'), (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data.toString())
      }
    })
  })

/**
 * Unify the given settings of configurations
 *
 */
const unify = (setting1, setting2) => {
  const uniqe = arr => {
    return arr.filter((element, index) => arr.indexOf(element) === index)
  }

  const unifiedSettings = setting1

  for (const key in setting2) {
    if (!unifiedSettings[key]) {
      unifiedSettings[key] = setting2[key]
    } else {
      if (Array.isArray(unifiedSettings[key]) && Array.isArray(setting2[key])) {
        // concatenate the arrays
        unifiedSettings[key] = unifiedSettings[key].concat(setting2[key])
        // remove the duplicated elements and join the array into a string
        unifiedSettings[key] = uniqe(unifiedSettings[key]).join(' ')
      } else if (!Array.isArray(unifiedSettings[key]) && Array.isArray(setting2[key])) {
        // split the first string into an array and concatenate the arrays
        unifiedSettings[key] = unifiedSettings[key].split(' ').concat(setting2[key])
        // remove the duplicated elements and join the array into a string
        unifiedSettings[key] = uniqe(unifiedSettings[key]).join(' ')
      } else if (unifiedSettings[key] !== setting2[key]) {
        throw new Error(`collision key ${key} ${setting1[key]} ${setting2[key]} in settings`)
      }
    }
  }

  return unifiedSettings
}

/**
 * Evaluate macros in the given string, using the given setting of configurations
 *
 */
const evaluateMacros = settings => str => {
  debug('evaluateMacros', settings)
  task('evaluate macros', str)

  for (const key in settings) {
    str = str.replace(new RegExp('\\$\\{' + key + '\\}', 'g'), settings[key])
  }

  return str
}

/**
 * Inject custom CSS
 *
 */
const injectCSS = (env, settings, marker = '<head>') => str => {
  debug('injectCSS', settings)
  task(`injectCSS`, str)

  if (settings) {
    const format = css => {
      // only inject test css if we are running a test
      if (!/^_test/.test(css) || process.env.RUNNING_KUI_TEST !== undefined) {
        const href = /^http/.test(css) ? css : `${env.cssHome}${css}`
        return `<link href="${href}" rel="stylesheet" nonce="kuiDefaultNonce">`
      } else {
        return ''
      }
    }

    const css = Array.isArray(settings)
      ? settings.reduce((links, css) => {
          return `${links}\n${format(css)}`
        }, '')
      : format(settings)

    return str.replace(marker, `${marker}${css}`)
  } else {
    return str
  }
}

/**
 * Write the updated index.html
 *
 */
const writeIndex = settings => str =>
  new Promise((resolve, reject) => {
    if (settings.build.writeIndex === false) {
      return resolve()
    }

    const indexHtml = `index${settings.env.nameSuffix !== undefined ? settings.env.nameSuffix : ''}.html`
    task(`write ${indexHtml} to ${settings.build.buildDir}`)

    fs.writeFile(path.join(settings.build.buildDir, indexHtml), str, err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })

/**
 * Do a build
 *
 */
const doBuild = settings => () =>
  readIndex(settings)
    .then(evaluateMacros(unify(settings.env, settings.theme)))
    .then(injectCSS(settings.env, settings.theme.css))
    .then(injectCSS(settings.env, settings.theme.cssOverrides, '<!-- css overrides go here -->'))
    .then(writeIndex(settings))

/**
 * Either project out a field of the configuration settings, or do a build
 *
 */
const doWork = settings => {
  info('env.main', settings.env.main)
  info('theme.cssHome', settings.theme.cssHome)
  info('theme.imageHome', settings.theme.imageHome)
  info('buildDir', settings.build.buildDir)

  return fs
    .mkdirp(settings.build.buildDir)
    .then(doBuild(settings))
    .then(() => colors.green('ok:') + ' build successful')
}

/**
 * Build index.html
 *
 */
const main = (env, overrides = {}) => {
  return parseOptions(env, overrides) // read options
    .then(settings => doWork(settings))
    .then(console.log)
    .catch(err => {
      console.error(err)
      process.exit(1)
    })
}

/**
 * Load the overrides from the KUI_BUILD_CONFIG or the default overrides location
 *
 * @param programmaticOverrides if we are being invoked programmatically, such as
 * from webpack.config.js, then this gives the caller the option to
 * specify some overrides via that programmatic call path
 *
 */
const loadOverrides = (programmaticOverrides = {}) => {
  let overrideDirectory = process.env.KUI_BUILD_CONFIG && path.resolve(process.env.KUI_BUILD_CONFIG)
  if (!overrideDirectory || !fs.existsSync(overrideDirectory)) {
    overrideDirectory =
      process.env.CLIENT_HOME &&
      path.resolve(path.join(process.env.CLIENT_HOME, 'node_modules/@kui-shell/client/config.d'))
    if (!overrideDirectory || !fs.existsSync(overrideDirectory)) {
      overrideDirectory = path.resolve(path.join(process.cwd(), 'node_modules/@kui-shell/client/config.d'))
    }
  }
  info('theme directory', overrideDirectory)

  const loadOverride = file => {
    try {
      if (overrideDirectory) {
        debug(`Using this override directory: ${overrideDirectory}`)
        return require(path.join(overrideDirectory, file))
      } else {
        return {}
      }
    } catch (err) {
      debug('error in loadOverride', err)
      return {}
    }
  }
  const userEnv = loadOverride('env')
  const userTheme = loadOverride('name')
  const userClient = loadOverride('client')
  const userStyle = loadOverride('style')
  const userIcons = loadOverride('icons')
  const userOpenGraph = loadOverride('opengraph')
  const userProxy = loadOverride('proxy')

  const overrides = {
    build: programmaticOverrides.build || {},
    env: Object.assign({}, userEnv, programmaticOverrides.env),
    theme: Object.assign({}, userTheme, userClient, userStyle, userIcons, userOpenGraph, programmaticOverrides.theme),
    config: Object.assign({}, userProxy, programmaticOverrides.config)
  }

  if (
    process.env.KUI_STAGE &&
    (!programmaticOverrides || !programmaticOverrides.build || !programmaticOverrides.build.buildDir)
  ) {
    overrides.build.buildDir = path.join(process.env.KUI_STAGE, 'node_modules/@kui-shell/build')
  }

  debug('overrides', overrides)
  return overrides
}

if (require.main === module) {
  const env = process.argv[2] || 'standalone'
  debug('called directly', env)
  main(env, loadOverrides())
} else {
  debug('required as a module')

  class Builder {
    /** @param env is one of the entries in ../defaults/envs */
    build(env, overrides) {
      return main(env, loadOverrides(overrides))
    }
  }

  module.exports = Builder
}
