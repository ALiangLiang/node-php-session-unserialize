function readKey(text) {
  var index = text.indexOf('|')
  var key = text.substr(0, index)
  var leftText = text.substr(index + 1)
  //console.log('readKey', leftText)
  return {
    value: key,
    leftText: leftText
  }
}

function readType(text) {
  var index = text.indexOf(':')
  // When type is N(null), it's like "N;". No ":".
  if(index === -1)
    index = text.indexOf(';')
  var type = text.substr(0, index)
  var leftText = text.substr(index + 1)
  //console.log('readType', leftText)
  return {
    value: type,
    leftText: leftText
  }
}

function readLength(text) {
  var index = text.indexOf(':')
  var length = Number(text.substr(0, index))
  if(Number.isNaN(length))
    throw new Error('Parse error: ' + length + ' is not a length.')
  var leftText = text.substr(index + 1)
  //console.log('readLength', leftText)
  return {
    value: length,
    leftText: leftText
  }
}

function readString(text) {
  var lengthAndText = readLength(text)
  // Shift out first quote.
  text = lengthAndText.leftText.substr(1)
  // Find another quote.
  var index = text.indexOf('"')
  var string = text.substr(0, index)
  var leftText = text.substr(index + 2)
  //console.log('readString', leftText)
  return {
    value: string,
    leftText: leftText
  }
}

function readNumber(text) {
  var index = text.indexOf(';')
  var number = Number(text.substr(0, index))
  if(Number.isNaN(number))
    throw new Error('Parse error: ' + number + ' is not a number.')
  var leftText = text.substr(index + 1)
  //console.log('readNumber', leftText)
  return {
    value: number,
    leftText: leftText
  }
}

function readBoolean(text) {
  var index = text.indexOf(';')
  var boolean = Number(text.substr(0, index))
  if(Number.isNaN(boolean) || (boolean !== 0 && boolean !== 1))
    throw new Error('Parse error: ' + boolean + ' is not a boolean number.')
  var leftText = text.substr(index + 1)
  //console.log('readBoolean', leftText)
  return {
    value: !!boolean,
    leftText: leftText
  }
}

function readNull(text) {
  return {
    value: null,
    leftText: text.substr(1)
  }
}

function readArray(text) {
  var lengthAndText = readLength(text)
  var length = lengthAndText.value
  var leftText = lengthAndText.leftText
  var array = []
  // Shift out first bracket.
  leftText = leftText.substr(1)
  for (var i = 0; i < length; i++) {
    var keyResult = readValue(leftText)
    leftText = keyResult.leftText
    var valueResult = readValue(leftText)
    leftText = valueResult.leftText
    var obj = {}
    obj[keyResult.value] = valueResult.value
    array.push(obj)
  }
  leftText = leftText.substr(1)
  //console.log('readArray', leftText)
  return {
    value: array,
    leftText: leftText
  }
}

function readObject(text) {
  // Get object name.
  var stringResult = readString(text)
  var leftText = stringResult.leftText
  var objectName = stringResult.value

  var object = {}
  var insideObject = object[objectName] = {}
  // Get object length.
  lengthAndText = readLength(leftText)
  leftText = lengthAndText.leftText
  var length = lengthAndText.value
  // Shift out first bracket.
  leftText = leftText.substr(1)
  for (var i = 0; i < length; i++) {
    var keyResult = readValue(leftText)
    leftText = keyResult.leftText
    var valueResult = readValue(leftText)
    leftText = valueResult.leftText
    insideObject[keyResult.value] = valueResult.value
  }
  leftText = leftText.substr(1)
  //console.log('readObject', leftText)
  return {
    value: object,
    leftText: leftText
  }
}

function readClass(text) {
  // Get class name.
  var stringResult = readString(text)
  var leftText = stringResult.leftText
  var _className = stringResult.value

  var _class = {}
  var insideClass = _class[_className] = []
  // Get class length.
  var lengthAndText = readLength(leftText)
  var length = lengthAndText.value
  leftText = lengthAndText.leftText
  // Shift out first bracket.
  leftText = leftText.substr(1)
  for (var i = 0; i < length; i++) {
    var valueResult = readValue(leftText)
    leftText = valueResult.leftText
    insideClass.push(valueResult.value)
  }
  leftText = leftText.substr(1)
  //console.log('readArray', leftText)
  return {
    value: insideClass,
    leftText: leftText
  }
}

function readValue(text) {
  var typeAndText = readType(text)
  var type = typeAndText.value
  switch(type.toLowerCase()) {
    case 's':   //s:len<string>:"<string>";
      return readString(typeAndText.leftText.trim())
    case 'i':   //i:<integer>;
    case 'd':   //d:<float>;
    case 'r':   //r:<integer>;
      return readNumber(typeAndText.leftText.trim())
    case 'a':   //a:len<array>:{<key>;<val>.....}
      return readArray(typeAndText.leftText.trim())
    case 'o':   //o:len<object_class_name>:<object_class_name>:len<object>:{<key>;<val>....}
      return readObject(typeAndText.leftText.trim())
    case 'c':   //c:len<class_name>:"<class_name>":len<val>:{<val>}
      return readClass(typeAndText.leftText.trim())
    case 'b':   //b:<digit>;  digit is either 1 or 0
      return readBoolean(typeAndText.leftText.trim())
    case 'n':   //n; null
      return readNull(typeAndText.leftText.trim())
    default:
      throw new Error('Unknown type: ' + type)
  }
}

function read(text) {
  var keyAndText = readKey(text)
  var result = readValue(keyAndText.leftText)
  var obj = {}
  obj[keyAndText.value] = result.value
  return {
    value: obj,
    leftText: result.leftText
  }
}

function unserializer(text) {
  var result = {}
  var readResult = {
    leftText: text
  }
  do {
    readResult = read(readResult.leftText)
    Object.assign(result, readResult.value)
  }
  while (readResult.leftText)
  return result
}

module.exports = unserializer