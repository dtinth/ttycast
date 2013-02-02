
/**
 * A ScreenBuffer represents a visible portion of a terminal in a screen.
 * A ScreenBuffer contains a lot of cells. Each cell contains a character
 * and attributes, such as color and boldness. It also keeps track of cursor position.
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

/** Returns things in the display buffer... */
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


/* ====================================================
 *  Here are the operations that can be performed on a ScreenBuffer.
 */

/** Sets the cursor position to (x, y) */
ScreenBuffer.prototype.setCursor = function(x, y) {
  this.cursorX = x
  this.cursorY = y
}

/** Returns the number of rows in this buffer */
ScreenBuffer.prototype.getRows = function() {
  return this.data.length
}

/** Returns the number of columns in a certain row in this buffer */
ScreenBuffer.prototype.getCols = function(row) {
  return this.data[row] ? this.data[row].length : 0
}

/** Sets the number of rows in this buffer */
ScreenBuffer.prototype.setRows = function(rows) {
  this.data.length = rows
}

/** Sets the number of columns in a certain row in this buffer */
ScreenBuffer.prototype.setCols = function(row, cols) {
  var arr = this.data[row] || (this.data[row] = [])
  arr.length = cols
}

/** Gets the cell at row `row`, column `col`.
 * Returns [ attributes, ch ] */
ScreenBuffer.prototype.getCell = function(row, col) {
  return this.data[row] ? (this.data[row][col] || [0, ' ']) : [0, ' ']
}

/**
 * Draws some data to this ScreenBuffer on row `row`, starting at column `col`.
 * The patcher will generate a command for this...
 * No need to use this directly.
 */
ScreenBuffer.prototype.draw = function(row, col, text, attrsCompressed) {

  // unpack the attributes
  var attrs = []
  for (var i = 0; i < attrsCompressed.length; i ++) {
    var c = attrsCompressed[i]
    for (var j = 0; j < c[1]; j ++) {
      attrs[attrs.length] = c[0]
    }
  }

  // draw...
  var arr = this.data[row] || (this.data[row] = [])
  for (var i = 0; i < attrs.length; i ++) {
    arr[col + i] = [attrs[i], text.charAt(i)]
  }

}

/**
 * Copy contents of a row.
 */
ScreenBuffer.prototype.copy = function(row, source) {

  // draw...
  var arr = this.data[row] || (this.data[row] = [])
  for (var i = 0; i < arr.length; i ++) {
    arr[i] = this.getCell(source, i).slice()
  }

}

if (typeof module != 'undefined') module.exports = ScreenBuffer
