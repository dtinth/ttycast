
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

/**
 * A headless terminal is a terminal with an internal screen buffer.
 * Here is the algorithm:
 *
 * We have two buffers:
 *   - the display buffer
 *   - the patch buffer
 *
 * When data is written to the terminal, it gets written to the display
 * buffer right away.
 *
 * After a while, the patch buffer will be updated to match the contents
 * of the display buffer. The draw operations needed for the patch buffer
 * to match its content with the display buffer is broadcasted to the
 * client, so clients can do the same too.
 */
function HeadlessTerminal(cols, rows, refresher) {
  this.patchBuffer = new ScreenBuffer()
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

  // wait for patch
  if (this.patchTimeout == null) {
    this.patchTimeout = setTimeout(this.updateDisplay.bind(this), 1000 / 30)
  }

}

HeadlessTerminal.prototype.updateDisplay = function() {

  // make the patch buffer's contents match with display buffer's
  this.patchTimeout = null
  var operations = patcher.patch(this.patchBuffer, this.displayBuffer)

  // also broadcast the operations used so client could do the same
  this.emit('screen', operations)

}

HeadlessTerminal.prototype.getInitialOperations = function() {

  // create the patch for empty buffer
  var buffer = new ScreenBuffer()
  return patcher.patch(buffer, this.patchBuffer)

}

module.exports = HeadlessTerminal

