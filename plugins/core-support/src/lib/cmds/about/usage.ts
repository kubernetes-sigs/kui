export default {
  version: {
    strict: 'version',
    command: 'version',
    title: 'Version Information',
    header: 'Print the current version of the Shell',
    example: 'version',
    optional: [
      { name: '--update-check',
        alias: '-u',
        docs: 'also check for updates'
      }
    ]
  }
}
