export const keys = {
  BACKSPACE: '\uE003',
  TAB: '\uE004',
  ENTER: '\uE007',
  DELETE: '\uE017',
  CONTROL: '\uE009',
  ESCAPE: '\uE00C',
  ctrlOrMeta: process.platform === 'darwin' ? '\uE03D' : '\uE009',
  ctrlC: ['\uE009', 'c', 'NULL'] // Send NULL to release Control key at the end of the call, otherwise the state of Control is kept between calls
}
