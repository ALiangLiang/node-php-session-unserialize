const expect = require('chai').expect
const unserialize = require('./../index.js')

describe('single type cases test', function () {
  it('string', function (done) {
    const expected = { key: 'foo' }
    const result = unserialize('key|s:3:"foo";')
    expect(result).to.deep.equal(expected)
    done()
  })
  it('integer', function (done) {
    const expected = { key: 87 }
    const result = unserialize('key|i:87;')
    expect(result).to.deep.equal(expected)
    done()
  })
  it('boolean', function (done) {
    const expected = { key: true }
    const result = unserialize('key|b:1;')
    expect(result).to.deep.equal(expected)
    done()
  })
  it('boolean with false', function (done) {
    const expected = { key: false }
    const result = unserialize('key|b:0;')
    expect(result).to.deep.equal(expected)
    done()
  })
  it('null', function (done) {
    const expected = { key: null }
    const result = unserialize('key|n;')
    expect(result).to.deep.equal(expected)
    done()
  })
  it('array', function (done) {
    const expected = { key: [] }
    const result = unserialize('key|a:0:{}')
    expect(result).to.deep.equal(expected)
    done()
  })
  it('object', function (done) {
    const expected = { key: { object: {} } }
    const result = unserialize('key|o:6:"object":0:{}')
    expect(result).to.deep.equal(expected)
    done()
  })
  it('class', function (done) {
    const expected = { key: { class: [] } }
    const result = unserialize('key|c:5:"class":0:{}')
    expect(result).to.deep.equal(expected)
    done()
  })
})

describe('complex cases test', function () {
  it('array', function (done) {
    const array = []
    array.foo = 87
    array.true = null
    const expected = { key: array }
    const result = unserialize('key|a:2:{s:3:"foo";i:87;b:1;n;}')
    expect(result).to.deep.equal(expected)
    done()
  })
  it('object', function (done) {
    const expected = { key: { object: { key: 'value', 8: 7 } } }
    const result = unserialize('key|o:6:"object":2:{s:3:"key";s:5:"value";i:8;i:7;}')
    expect(result).to.deep.equal(expected)
    done()
  })
  it('class', function (done) {
    const expected = { key: { class: ['foo', 87, true, null] } }
    const result = unserialize('key|c:5:"class":4:{s:3:"foo";i:87;b:1;n;}')
    expect(result).to.deep.equal(expected)
    done()
  })
})

describe('multiple key test', function () {
  it('two simple key', function (done) {
    const expected = { key: 'foo', key2: 'bar' }
    const result = unserialize('key|s:3:"foo";key2|s:3:"bar"')
    expect(result).to.deep.equal(expected)
    done()
  })
  it('two complex key', function (done) {
    const expected = { key: { object: { key: 'value', 8: 7 } }, key2: { class: ['foo', 87, true, null] } }
    const result = unserialize('key|o:6:"object":2:{s:3:"key";s:5:"value";i:8;i:7;}key2|c:5:"class":4:{s:3:"foo";i:87;b:1;n;}')
    expect(result).to.deep.equal(expected)
    done()
  })
})

describe('special cases test', function () {
  it('CJK string', function (done) {
    const expected = { chinese: '阿良良', japanese: 'ア・リャン', korean: '아량' }
    const result = unserialize('chinese|s:3:"阿良良";japanese|s:5:"ア・リャン";korean|s:2:"아량";')
    expect(result).to.deep.equal(expected)
    done()
  })
})

describe('real cases test', function () {
  it('real case1', function (done) {
    const cfas = []
    cfas.allow = null
    cfas.referer = 'https://www.google.com'
    cfas.cfsr = '1b6838e48b591ef2eba5f2e55a99f87e64fc42a3f7c2871fe85f91a3310a934bc2f6c750'
    const expected = {
      '2f11e1701981e3cdaf1ca2a8b9ed0986__returnUrl': '/search/',
      '2f11e1701981e3cdaf1ca2a8b9ed0986__id': 'ALiangLiang',
      '2f11e1701981e3cdaf1ca2a8b9ed0986__name': 'ALiangLiang',
      '2f11e1701981e3cdaf1ca2a8b9ed0986__states': [],
      cfas: cfas
    }
    const result = unserialize('2f11e1701981e3cdaf1ca2a8b9ed0986__returnUrl|s:8:"/search/";2f11e1701981e3cdaf1ca2a8b9ed0986__id|s:11:"ALiangLiang";2f11e1701981e3cdaf1ca2a8b9ed0986__name|s:11:"ALiangLiang";2f11e1701981e3cdaf1ca2a8b9ed0986__states|a:0:{}cfas|a:3:{s:5:"allow";N;s:7:"referer";s:22:"https://www.google.com";s:4:"cfsr";s:72:"1b6838e48b591ef2eba5f2e55a99f87e64fc42a3f7c2871fe85f91a3310a934bc2f6c750";}')
    expect(result).to.deep.equal(expected)
    done()
  })
})

describe('wrong cases test', function () {
  it('wrong type of integer value', function (done) {
    const expected = 'Parse error: "foo" is not a number., Left text: ""'
    const result = function () {
      unserialize('key|i:foo;')
    }
    expect(result).to.throw(expected)
    done()
  })
  it('wrong type of boolean value', function (done) {
    const expected = 'Parse error: "foo" is not a boolean number., Left text: ""'
    const result = function () {
      unserialize('key|b:foo;')
    }
    expect(result).to.throw(expected)
    done()
  })
  it('unknown type', function (done) {
    const expected = 'Unknown type: "z" at offset 6, Left text: "foo;"'
    const result = function () {
      unserialize('key|z:foo;')
    }
    expect(result).to.throw(expected)
    done()
  })
})
