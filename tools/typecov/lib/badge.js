const main = _ => ({
  schemaVersion: 1,
  label: 'typecov',
  message: _.typecov.toFixed(0) + '%',
  namedLogo: 'TypeScript',
  color: 'orange'
})
