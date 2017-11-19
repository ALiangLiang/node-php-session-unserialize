# node-php-session-unserialize

[![Build Status](https://travis-ci.org/ALiangLiang/node-php-session-unserialize.svg?branch=master)](https://travis-ci.org/ALiangLiang/node-php-session-unserialize)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Coverage Status](https://coveralls.io/repos/github/ALiangLiang/node-php-session-unserialize/badge.svg)](https://coveralls.io/github/ALiangLiang/node-php-session-unserialize)

For unserialize PHP session in redis. When your PHP session in redis is like this `62kf0k2a4minrtcbr6h1l104r2|a:5:{s:3:"bar";c:4:"name":2:{s:3:"foo";i:9;}s:4:"user";s:4:"foo2";s:6:"result";b:1;s:5:"group";i:9;s:9:"is_banned";i:0;}`. This module can help you parse it into JSON.

```js
const unserializer = require('php-session-unserialize')
const session = `62kf0k2a4minrtcbr6h1l104r2|a:5:{s:3:"bar";c:4:"name":2:{s:3:"foo";i:9;}s:4:"user";s:4:"foo2";s:6:"result";b:1;s:5:"group";i:9;s:9:"is_banned";i:0;}`
console.log(unserializer(session))
/*
output:
{
	'62kf0k2a4minrtcbr6h1l104r2': [
      bar: {
        name: [Array]
      },
      user: 'foo2',
      result: true,
      group: 9,
      is_banned: 0
    ]
}

```
* More example can see output of testing. `test/index.js`

## Install

```bash
$ npm install php-session-unserialize
```

## Test

```bash
$ npm test
```

## TODO

- Much clear error handle.
- Browser support.

## License

[MIT](LICENSE)