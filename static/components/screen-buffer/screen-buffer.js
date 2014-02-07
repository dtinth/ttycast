/*jshint bitwise:false*/

// ScreenBuffer
// ============
// A ScreenBuffer represents a visible portion of a terminal in a screen.
// A ScreenBuffer contains a lot of cells.
// Each cell contains a character and attributes,
// such as color and boldness.
// It also keeps track of cursor position.
//
// ## Cell Attributes
//
// Currently the attributes is a 21-bit integer. From MSB:
//
//  * 1 bit - inverse video flag
//  * 1 bit - underline flag
//  * 1 bit - bold flag
//  * 9 bits - foreground color (according to xterm-256)
//  * 9 bits - background color (according to xterm-256)
//
// There are two special values for colors:
//
//  * 257 - default foreground color
//  * 256 - default background color
//  
// ## API
//
function ScreenBuffer() {
  this.data = []
}

ScreenBuffer.EMPTY_CELL = [(257 << 9) | 256, ' ']

// ### update(y, [ [attr, char], [attr, char], ... ]) 
//
// Set one line of data in the ScreenBuffer.
// y is the row in the screen and data array looks like this:
//     [ [attribute, character], ... ]
//
ScreenBuffer.prototype.update = function(y, target) {
  var arr = this.data[y] || (this.data[y] = [])
  arr.length = target.length
  for (var i = 0; i < target.length; i ++) {
    if (target[i]) {
      arr[i] = [target[i][0], target[i][1]]
    } else {
      arr[i] = null
    }
  }
}

// ### toString()
//
// Returns the string in the display buffer.
//
ScreenBuffer.prototype.toString = function() {
  var lines = []
  for (var i = 0; i < this.data.length; i ++) {
    var arr = this.data[i], o = ''
    if (arr) for (var j = 0; j < arr.length; j ++) {
      o += arr[j] ? arr[j][1] : ' '
    }
    lines.push(o)
  }
  return lines.join('\n')
}


// ### setCursor(x, y)
//
// Sets the cursor position.
//
ScreenBuffer.prototype.setCursor = function(x, y) {

  // ### cursorX
  //
  // The X position of the cursor.
  //
  this.cursorX = x

  // ### cursorY
  //
  // The Y position of the cursor.
  //
  this.cursorY = y
}

// ### getRows()
//
// Returns the number of rows in the buffer.
//
ScreenBuffer.prototype.getRows = function() {
  return this.data.length
}

// ### getCols(row)
//
// Returns the number of characters in this row.
//
ScreenBuffer.prototype.getCols = function(row) {
  return this.data[row] ? this.data[row].length : 0
}

// ### setRows(rows)
//
// Resizes the number of rows.
//
ScreenBuffer.prototype.setRows = function(rows) {
  this.data.length = rows
}

// ### setCols(row, cols)
//
// Resizes the number of columns in the specified row.
//
ScreenBuffer.prototype.setCols = function(row, cols) {
  var arr = this.data[row] || (this.data[row] = [])
  arr.length = cols
}

// ### getCell(row, col)
//
// Returns the cell at (row, col).
// Returned value is in form of [ attributes, ch ].
//
ScreenBuffer.prototype.getCell = function(row, col) {
  return (this.data[row] && this.data[row][col]) || ScreenBuffer.EMPTY_CELL
}

// ### setCell(row, col, cell)
//
// Sets the cell at (row, col). A cell is in form of [ attributes, ch ].
//
ScreenBuffer.prototype.setCell = function(row, col, cell) {
  var arr = this.data[row] || (this.data[row] = [])
  arr[col] = cell
}

// ### resize(rows, cols)
// 
// Resizes the screen buffer.
//
ScreenBuffer.prototype.resize = function(rows, cols) {
  this.setRows(rows)
  for (var i = 0; i < rows; i ++) this.setCols(i, cols)
}

// ### clone()
//
// Returns a clone of the screen buffer.
//
ScreenBuffer.prototype.clone = function() {
  var clone = new ScreenBuffer()
  clone.setRows(this.getRows())
  clone.setCursor(this.cursorX, this.cursorY)
  for (var i = 0; i < this.data.length; i ++) {
    if (this.data[i]) clone.update(i, this.data[i])
  }
  return clone
}

// ### getRow(row)
//
// Returns a row data array. _Don't modify it!_
//
ScreenBuffer.prototype.getRow = function(row) {
  return this.data[row]
}

if (typeof module != 'undefined') module.exports = ScreenBuffer






