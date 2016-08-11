/*!
 * safe-trim v1.0.0
 * (c) 2016 Jerry
 * Released under the MIT License.
 */
'use strict';

function safeTrim(string) {
  var SP = ' '; // common space
  var CR = '\r'; //  Carriage Return, Used as a new line character in Mac OS before X
  var LF = '\n'; //  Line Feed, Used as a new line character in Unix/Mac OS X
  var CR_LF = '\r\n'; // Used as a new line character in Windows

  var OTHER_SPACE = '\t\u000b\f  ᠎             　\u2028\u2029﻿';
  var ALL_SPACE = SP + CR + LF + CR_LF + OTHER_SPACE;

  var leftReg = new RegExp('^[' + ALL_SPACE + ']+');
  var rightReg = new RegExp('[' + ALL_SPACE + ']+$');
  var otherReg = new RegExp('[' + OTHER_SPACE + ']', 'g');

  return (string + '').replace(leftReg, '') // trim left
  .replace(rightReg, '') // trim right
  .replace(new RegExp(CR_LF, 'g'), LF) // CR_LF to LF
  .replace(new RegExp(CR, 'g'), LF) // single CR to LF
  .replace(otherReg, '');
}

module.exports = safeTrim;