/** from https://github.com/chalk/ansi-regex; MIT licensed */
// eslint-disable-next-line no-control-regex
const ansiRegex = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g

/** from https://github.com/chalk/strip-ansi; MIT licensed */
export default (str: string) => (typeof str === 'string' ? str.replace(ansiRegex, '') : str)
