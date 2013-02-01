
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

Terminal.cursorBlink = false

/**
 * A headless terminal is a terminal with an internal screen buffer.
 * Don't forget to open() the terminal!
 * 
 * When the display is changed, the `change` event is emitted
 * with the display buffer as an argument.
 */
function HeadlessTerminal(cols, rows, refresher) {
  this.displayBuffer = new ScreenBuffer()
  Terminal.call(this, cols, rows)
}

Terminal.inherits(HeadlessTerminal, Terminal)

HeadlessTerminal.Terminal = Terminal

HeadlessTerminal.prototype.refresh = function(start, end) {

  // update the display buffer
  for (var y = start; y <= end; y ++) {
    var row = y + this.ydisp
      , line = this.lines[row]
    this.displayBuffer.update(y, line)
  }
  this.displayBuffer.cursorX = this.x
  this.displayBuffer.cursorY = this.y

  // emit the change event
  this.emit('change', this.displayBuffer, start, end)

}

module.exports = HeadlessTerminal

