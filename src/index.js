export default function safeTrim(string) {
  const SP = ' '  // common space
  const CR = '\r' //  Carriage Return, Used as a new line character in Mac OS before X
  const LF = '\n' //  Line Feed, Used as a new line character in Unix/Mac OS X
  const CR_LF = '\r\n' // Used as a new line character in Windows

  const OTHER_SPACE =
    '\x09\x0B\x0C\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF'
  const ALL_SPACE = SP + CR + LF + CR_LF + OTHER_SPACE

  const leftReg = new RegExp(`^[${ALL_SPACE}]+`)
  const rightReg = new RegExp(`[${ALL_SPACE}]+$`)
  const otherReg = new RegExp(`[${OTHER_SPACE}]`, 'g')

  return (string + '')
    .replace(leftReg, '') // trim left
    .replace(rightReg, '') // trim right
    .replace(new RegExp(CR_LF, 'g'), LF) // CR_LF to LF
    .replace(new RegExp(CR, 'g'), LF) // single CR to LF
    .replace(otherReg, '')
}
