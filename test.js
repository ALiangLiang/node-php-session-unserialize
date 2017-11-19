var _ = require('lodash')
var assert = require('assert')
var unserializer = require('./index.js')

var a = `a2a8b9ed7019812f11ee09861e3caf1c__returnUrl|s:6:"/login";62kf0k2a4minrtcbr6h1l104r2|a:6:{s:3:"bar";c:4:"name":2:{s:3:"foo";i:9;}s:4:"user";s:4:"foo2";s:6:"result";b:1;s:5:"group";i:9;s:9:"is_banned";i:0;s:4:"null";N;}`
var unserialized = unserializer(a)
console.log(a)
console.log('unserialized to ')
console.log(unserialized)
assert(_.isEqual(unserialized, { a2a8b9ed7019812f11ee09861e3caf1c__returnUrl: '/login',
'62kf0k2a4minrtcbr6h1l104r2':
 [ { bar: [ 'foo', 9 ] },
   { user: 'foo2' },
   { result: true },
   { group: 9 },
   { is_banned: 0 },
   { null: null } ] }))
console.info('pass')