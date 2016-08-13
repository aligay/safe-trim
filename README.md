[![Build Status](https://travis-ci.org/haozime/safe-trim.svg?branch=master)](https://travis-ci.org/haozime/safe-trim/branches)
[![codecov](https://codecov.io/gh/haozime/safe-trim/branch/master/graph/badge.svg)](https://codecov.io/gh/haozime/safe-trim)
[![Dependency Status](https://david-dm.org/haozime/safe-trim.svg)](https://david-dm.org/haozime/safe-trim)

# safe-trim
## install
```
npm install safe-trim
```
## use
```
import safeTrim from 'safe-trim'
safeTrim('    a      b  ')
```

## remove Invisible spaces

```
let str = '  "a":1    a \r\n\r\t  ᠎             　b       '
let ret = safeTrim(str)
expect(ret).toEqual('"a":1    a\n\nb')
```

## convert CR CR-LR into LR
```
a\r\n\r\nb  => 'a\n\nb'
a\r\rb => 'a\n\nb'
a\r\r\nb => 'a\n\nb'
```

## remove BOM
```
JSON.parse('﻿{"a":1}') // ❗️Error because BOM

JSON.parse(safeTrim('﻿{"a":1}')) // ✅
```


## more feature
[more feature](test/test_spec.js)
