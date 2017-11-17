# php-session-unserialize

For unserialize PHP session in redis. When your PHP session in redis is like this `62kf0k2a4minrtcbr6h1l104r2|a:5:{s:3:"bar";c:4:"name":2:{s:3:"foo";i:9;}s:4:"user";s:4:"foo2";s:6:"result";b:1;s:5:"group";i:9;s:9:"is_banned";i:0;}`. This module can help you parse it into JSON.

```js
const unserializer = require('php-session-unserialize')
const session = `62kf0k2a4minrtcbr6h1l104r2|a:5:{s:3:"bar";c:4:"name":2:{s:3:"foo";i:9;}s:4:"user";s:4:"foo2";s:6:"result";b:1;s:5:"group";i:9;s:9:"is_banned";i:0;}`
console.log(unserializer(session))
/*
output:
{
	"a2a8b9ed7019812f11ee09861e3caf1c__returnUrl": "/login",
	"62kf0k2a4minrtcbr6h1l104r2": [{
			"bar": ["foo", 9]
		}, {
			"user": "foo2"
		}, {
			"result": true
		}, {
			"group": 9
		}, {
			"is_banned": 0
		}
	]
}
*/
```

## Install

```bash
$ npm install ALiangLiang/php-session-unserialize
```

## Contribution

Coz this module has some part need to improve, although it can work normally. But sometimes, like someone use it in not normal situation `abc|i : 3`. It will cause some error.