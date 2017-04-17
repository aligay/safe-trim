/*!
 * safe-trim v1.0.13
 * (c) 2017 Jerry
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.safeTrim = factory());
}(this, (function () {

function safeTrim (string) {
  var SP = ' ';  // common space
  var TAB = '\t'; // tab
  var CR = '\r'; //  Carriage Return, Used as a new line character in Mac OS before X
  var LF = '\n'; //  Line Feed, Used as a new line character in Unix/Mac OS X
  var CR_LF = '\r\n'; // Used as a new line character in Windows
  var ZERO_WIDTH_SPACE = '\v' +  // \x0B VT 垂直制表符
                           '\f' + //  \x0C FF 换页符
                           '\u200B\u200C\u200D\u200E\u200F\u000b\u2028\u2029\uFEFF';
  var OTHER_SPACE =
    '\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000';

  var ALL_SPACE = SP + TAB + CR + LF + CR_LF + ZERO_WIDTH_SPACE + OTHER_SPACE;

  var leftReg = new RegExp(("^[" + ALL_SPACE + "]+"));
  var rightReg = new RegExp(("[" + ALL_SPACE + "]+$"));
  var zeroReg = new RegExp(("[" + ZERO_WIDTH_SPACE + "]+"), 'g');
  var otherReg = new RegExp(("[" + OTHER_SPACE + "]+"), 'g');

  return (string + '')
    .replace(leftReg, '') // trim left
    .replace(rightReg, '') // trim right
    .replace(new RegExp(TAB, 'g'), '') // TAB => ''
    .replace(new RegExp(CR_LF, 'g'), LF) // '\r\n' => '\n'
    .replace(new RegExp(CR, 'g'), LF)  // single \r => '\n'
    .replace(zeroReg, '') // Zero-width-space => ''
    .replace(otherReg, '') // other => ''
    .trim() // safety
}

return safeTrim;

})));
