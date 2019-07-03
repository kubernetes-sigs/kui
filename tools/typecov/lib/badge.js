// eslint-disable-next-line @typescript-eslint/no-unused-vars
const main = ({ which = 'overall', typecov }) => ({
  schemaVersion: 1,
  label: `typecov ${which}`,
  message: typecov[which].percentage.toFixed(0) + '%',
  namedLogo: 'TypeScript',
  color: 'orange'
})
