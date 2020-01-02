/** from https://github.com/chalk/ansi-regex; MIT licensed */
// eslint-disable-next-line no-control-regex
const pattern = [
  '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
  '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))'
].join('|')

const ansiRegex = new RegExp(pattern, 'g')

/** from https://github.com/chalk/strip-ansi; MIT licensed */
export default (str: string) => (typeof str === 'string' ? str.replace(ansiRegex, '') : str)
