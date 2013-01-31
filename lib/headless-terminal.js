
// dummy dom api
if (typeof global != 'undefined') {

  if (!global.navigator) {
    global.navigator = { userAgent: '' }
  }

  if (!global.document) {
    global.document = {
      addEventListener: function() { }
    , createElement: function() {
        return {
          addEventListener: function() { }
        , appendChild: function() { }
        , removeChild: function() { }
        , style: {}
        }
      }
    }
    global.document.body = global.document.createElement('body')
  }

}


var Terminal = require('./../vendor/term')
  , ScreenBuffer = require('./screen-buffer')
  , patcher = require('./buffer-patcher')

Terminal.cursorBlink = false

function HeadlessTerminal(cols, rows, refresher) {
  this.patchBuffer = new ScreenBuffer()
  this.displayBuffer = new ScreenBuffer()
  Terminal.call(this, cols, rows)
}

Terminal.inherits(HeadlessTerminal, Terminal)

HeadlessTerminal.Terminal = Terminal
HeadlessTerminal.prototype.refresh = function(start, end) {
  for (var y = start; y <= end; y ++) {
    var row = y + this.ydisp
      , line = this.lines[row]
    this.displayBuffer.update(y, line)
  }
  this.displayBuffer.cursorX = this.x
  this.displayBuffer.cursorY = this.y
  if (this.patchTimeout == null) {
    this.patchTimeout = setTimeout(this.updateDisplay.bind(this), 1000 / 30)
  }
}
HeadlessTerminal.prototype.updateDisplay = function() {
  this.patchTimeout = null
  var operations = patcher.patch(this.patchBuffer, this.displayBuffer)
  this.emit('screen', operations)
}
HeadlessTerminal.prototype.getInitialOperations = function() {
  var buffer = new ScreenBuffer()
  return patcher.patch(buffer, this.patchBuffer)
}

module.exports = HeadlessTerminal

