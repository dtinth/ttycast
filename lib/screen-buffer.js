

/**
 * A ScreenBuffer represents a buffer of characters in the screen.
 */
function ScreenBuffer() {
  this.data = []
}

/**
 * Set one line of data in the ScreenBuffer.
 * y is the row in the screen and data array looks like this:
 *     [ [attribute, character], ... ]
 */
ScreenBuffer.prototype.update = function(y, target) {
  var arr = this.data[y] || (this.data[y] = [])
  for (var i = 0; i < target.length; i ++) {
    if (target[i]) {
      arr[i] = [target[i][0], target[i][1]]
    } else {
      arr[i] = [0, ' ']
    }
  }
}

ScreenBuffer.prototype.setCursor = function(x, y) {
  this.cursorX = x
  this.cursorY = y
}

ScreenBuffer.prototype.getRows = function() {
  return this.data.length
}

ScreenBuffer.prototype.getCols = function(row) {
  return this.data[row] ? this.data[row].length : 0
}

ScreenBuffer.prototype.setRows = function(rows) {
  this.data.length = rows
}

ScreenBuffer.prototype.setCols = function(row, cols) {
  var arr = this.data[row] || (this.data[row] = [])
  arr.length = cols
}

ScreenBuffer.prototype.getCell = function(row, col) {
  return this.data[row] ? (this.data[row][col] || [0, ' ']) : [0, ' ']
}

ScreenBuffer.prototype.draw = function(row, col, text, attrsCompressed) {
  var attrs = []
  for (var i = 0; i < attrsCompressed.length; i ++) {
    var c = attrsCompressed[i]
    for (var j = 0; j < c[1]; j ++) {
      attrs[attrs.length] = c[0]
    }
  }
  var arr = this.data[row] || (this.data[row] = [])
  for (var i = 0; i < attrs.length; i ++) {
    arr[col + i] = [attrs[i], text.charAt(i)]
  }
}

ScreenBuffer.prototype.toString = function() {
  var lines = []
  for (var i = 0; i < this.data.length; i ++) {
    var arr = this.data[i], o = ''
    for (var j = 0; j < arr.length; j ++) {
      if (arr[j]) o += arr[j][1]
    }
    lines.push(o)
  }
  return lines.join('\n')
}

if (typeof module != 'undefined') module.exports = ScreenBuffer
