export default function safeTrim (string) {
  const SP = ' ' // common space
  const TAB = '\t' // tab
  const CR = '\r' //  Carriage Return, Used as a new line character in Mac OS before X
  const LF = '\n' //  Line Feed, Used as a new line character in Unix/Mac OS X
  const CR_LF = '\r\n' // Used as a new line character in Windows
  const ZERO_WIDTH_SPACE = '\v' + // \x0B VT 垂直制表符
                           '\f' + //  \x0C FF 换页符
                           '\u200B\u200C\u200D\u200E\u200F\u000b\u2028\u2029\uFEFF\u202D'
  const OTHER_SPACE =
    '\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000⁧‍'

  const ALL_SPACE = SP + TAB + CR + LF + CR_LF + ZERO_WIDTH_SPACE + OTHER_SPACE

  const leftReg = new RegExp(`^[${ALL_SPACE}]+`)
  const rightReg = new RegExp(`[${ALL_SPACE}]+$`)
  const zeroReg = new RegExp(`[${ZERO_WIDTH_SPACE}]+`, 'g')
  const otherReg = new RegExp(`[${OTHER_SPACE}]+`, 'g')

  return (string + '')
    .replace(leftReg, '') // trim left
    .replace(rightReg, '') // trim right
    .replace(new RegExp(TAB, 'g'), '') // TAB => ''
    .replace(new RegExp(CR_LF, 'g'), LF) // '\r\n' => '\n'
    .replace(new RegExp(CR, 'g'), LF) // single \r => '\n'
    .replace(zeroReg, '') // Zero-width-space => ''
    .replace(otherReg, '') // other => ''
    .trim() // safety
}
