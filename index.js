function readUntil (array, keywords) {
  if (typeof keywords === 'string') {
    keywords = [keywords]
  }
  var value = ''
  while (array.length && keywords.indexOf(array[0]) === -1) {
    value += array.shift()
    array.offset += 1
  }
  array.shift()
  array.offset += 1
  return value
}

function readString (array) {
  readUntil(array, ':')
  readUntil(array, '"')
  var string = readUntil(array, '"')
  readUntil(array, ';')
  // console.log('readString', leftText)
  return string
}

function readNumber (array) {
  var numberString = readUntil(array, ';')
  var number = Number(numberString)
  if (Number.isNaN(number)) {
    throw new Error('Parse error: "' + numberString + '" is not a number.')
  }
  // console.log('readNumber', leftText)
  return number
}

function readBoolean (array) {
  var booleanString = readUntil(array, ';')
  if (booleanString !== '0' && booleanString !== '1') {
    throw new Error('Parse error: "' + booleanString + '" is not a boolean number.')
  }
  var boolean = !!booleanString
  // console.log('readBoolean', leftText)
  return boolean
}

function readNull (array) {
  return null
}

function readArray (array) {
  var length = readUntil(array, ':')
  var resultArray = []
  // Shift out first bracket.
  readUntil(array, '{')
  for (var i = 0; i < length; i++) {
    var key = readValue(array)
    var value = readValue(array)
    resultArray[key] = value
  }
  readUntil(array, '}')
  // console.log('readArray', leftText)
  return resultArray
}

function readObject (array) {
  // Remove object name length.
  readUntil(array, ':')
  // Get object name.
  readUntil(array, '"')
  var resultObjectName = readUntil(array, '"')
  readUntil(array, ':')

  var resultObject = {}
  var insideResultObject = resultObject[resultObjectName] = {}
  // Get object length.
  var length = readUntil(array, ':')
  // Shift out first bracket.
  readUntil(array, '{')
  for (var i = 0; i < length; i++) {
    var key = readValue(array)
    var value = readValue(array)
    insideResultObject[key] = value
  }
  readUntil(array, '}')
  // console.log('readObject', leftText)
  return resultObject
}

function readClass (array) {
  // Remove class name length.
  readUntil(array, ':')
  // Get class name.
  readUntil(array, '"')
  var resultClassName = readUntil(array, '"')
  readUntil(array, ':')

  var resultClass = {}
  var insideResultClass = resultClass[resultClassName] = []
  // Get class length.
  var length = readUntil(array, ':')
  // Shift out first bracket.
  readUntil(array, '{')
  for (var i = 0; i < length; i++) {
    var value = readValue(array)
    insideResultClass.push(value)
  }
  readUntil(array, '}')
  // console.log('readArray', leftText)
  return resultClass
}

function readValue (array) {
  var type = readUntil(array, [':', ';'])
  switch (type.toLowerCase()) {
    case 's': // s:len<string>:"<string>";
      return readString(array)
    case 'i': // i:<integer>;
    case 'd': // d:<float>;
    case 'r': // r:<integer>;
      return readNumber(array)
    case 'a': // a:len<array>:{<key>;<val>.....}
      return readArray(array)
    case 'o': // o:len<object_class_name>:<object_class_name>:len<object>:{<key>;<val>....}
      return readObject(array)
    case 'c': // c:len<class_name>:"<class_name>":len<val>:{<val>}
      return readClass(array)
    case 'b': // b:<digit>;  digit is either 1 or 0
      return readBoolean(array)
    case 'n': // n; null
      return readNull(array)
    default:
      throw new Error('Unknown type: "' + type + '" at offset ' + array.offset)
  }
}

function read (array) {
  // Read key.
  var key = readUntil(array, '|')
  // Read value.
  var value = readValue(array)
  var result = {}
  result[key] = value
  return result
}

function unserializer (text) {
  var result = {}
  var array = Array.from(text)
  array.offset = 0
  do {
    try {
      Object.assign(result, read(array))
    } catch (err) {
      err.message += ', Left text: "' + array.join('') + '"'
      throw err
    }
  }
  while (array.length)
  return result
}

module.exports = unserializer
