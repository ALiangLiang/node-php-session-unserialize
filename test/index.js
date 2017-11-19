var expect = require('chai').expect
var unserialize = require('./../index.js')

describe('single type cases test', function () {
  it('string', function (done) {
    var expected = {key: 'foo'}
    var result = unserialize('key|s:3:"foo";')
    expect(result).to.deep.equal(expected)
    done()
  })
  it('integer', function (done) {
    var expected = {key: 87}
    var result = unserialize('key|i:87;')
    expect(result).to.deep.equal(expected)
    done()
  })
  it('boolean', function (done) {
    var expected = {key: true}
    var result = unserialize('key|b:1;')
    expect(result).to.deep.equal(expected)
    done()
  })
  it('null', function (done) {
    var expected = {key: null}
    var result = unserialize('key|n;')
    expect(result).to.deep.equal(expected)
    done()
  })
  it('array', function (done) {
    var expected = {key: []}
    var result = unserialize('key|a:0:{}')
    expect(result).to.deep.equal(expected)
    done()
  })
  it('object', function (done) {
    var expected = {key: {object: {}}}
    var result = unserialize('key|o:6:"object":0:{}')
    expect(result).to.deep.equal(expected)
    done()
  })
  it('class', function (done) {
    var expected = {key: {class: []}}
    var result = unserialize('key|c:5:"class":0:{}')
    expect(result).to.deep.equal(expected)
    done()
  })
})

describe('complex cases test', function () {
  it('array', function (done) {
    var array = []
    array['foo'] = 87
    array[true] = null
    var expected = {key: array}
    var result = unserialize('key|a:2:{s:3:"foo";i:87;b:1;n;}')
    expect(result).to.deep.equal(expected)
    done()
  })
  it('object', function (done) {
    var expected = {key: {object: {key: 'value', 8: 7}}}
    var result = unserialize('key|o:6:"object":2:{s:3:"key";s:5:"value";i:8;i:7;}')
    expect(result).to.deep.equal(expected)
    done()
  })
  it('class', function (done) {
    var expected = {key: {class: ['foo', 87, true, null]}}
    var result = unserialize('key|c:5:"class":4:{s:3:"foo";i:87;b:1;n;}')
    expect(result).to.deep.equal(expected)
    done()
  })
})

describe('multiple key test', function () {
  it('two simple key', function (done) {
    var expected = {key: 'foo', key2: 'bar'}
    var result = unserialize('key|s:3:"foo";key2|s:3:"bar"')
    expect(result).to.deep.equal(expected)
    done()
  })
  it('two complex key', function (done) {
    var expected = {key: {object: {key: 'value', 8: 7}}, key2: {class: ['foo', 87, true, null]}}
    var result = unserialize('key|o:6:"object":2:{s:3:"key";s:5:"value";i:8;i:7;}key2|c:5:"class":4:{s:3:"foo";i:87;b:1;n;}')
    expect(result).to.deep.equal(expected)
    done()
  })
})

describe('special cases test', function () {
  it('CJK string', function (done) {
    var expected = {chinese: '阿良良', japanese: 'ア・リャン', korean: '아량'}
    var result = unserialize('chinese|s:3:"阿良良";japanese|s:5:"ア・リャン";korean|s:2:"아량";')
    expect(result).to.deep.equal(expected)
    done()
  })
})

describe('real cases test', function () {
  it('real case1', function (done) {
    var cfas = []
    cfas['allow'] = null
    cfas['referer'] = 'https://www.google.com'
    cfas['cfsr'] = '1b6838e48b591ef2eba5f2e55a99f87e64fc42a3f7c2871fe85f91a3310a934bc2f6c750'
    var expected = {
      '2f11e1701981e3cdaf1ca2a8b9ed0986__returnUrl': '/search/',
      '2f11e1701981e3cdaf1ca2a8b9ed0986__id': 'ALiangLiang',
      '2f11e1701981e3cdaf1ca2a8b9ed0986__name': 'ALiangLiang',
      '2f11e1701981e3cdaf1ca2a8b9ed0986__states': [],
      cfas: cfas
    }
    var result = unserialize(`2f11e1701981e3cdaf1ca2a8b9ed0986__returnUrl|s:8:"/search/";2f11e1701981e3cdaf1ca2a8b9ed0986__id|s:11:"ALiangLiang";2f11e1701981e3cdaf1ca2a8b9ed0986__name|s:11:"ALiangLiang";2f11e1701981e3cdaf1ca2a8b9ed0986__states|a:0:{}cfas|a:3:{s:5:"allow";N;s:7:"referer";s:22:"https://www.google.com";s:4:"cfsr";s:72:"1b6838e48b591ef2eba5f2e55a99f87e64fc42a3f7c2871fe85f91a3310a934bc2f6c750";}`)
    expect(result).to.deep.equal(expected)
    done()
  })
})


describe('wrong cases test', function () {
  it('wrong type of integer value', function (done) {
    var expected = 'Parse error: "foo" is not a number., Left text: ""'
    var result = function() {
      unserialize('key|i:foo;')
    }
    expect(result).to.throw(expected);
    done()
  })
  it('wrong type of boolean value', function (done) {
    var expected = 'Parse error: "foo" is not a boolean number., Left text: ""'
    var result = function() {
      unserialize('key|b:foo;')
    }
    expect(result).to.throw(expected);
    done()
  })
  it('unknown type', function (done) {
    var expected = 'Unknown type: "z" at offset 6, Left text: "foo;"'
    var result = function() {
      unserialize('key|z:foo;')
    }
    expect(result).to.throw(expected);
    done()
  })
})
