
void function() {

  // ### ScreenBuffer.patch(screenbuffer, operations)
  //
  // Applies the operations from the diff array onto the screenbuffer.
  //
  function patch(screenbuffer, operations) {

    var backbuffer = screenbuffer.clone()

    operations.forEach(function(op) {
      if (typeof op == 'number') {
        screenbuffer.setRows(op)
      } else if (op.length == 2) {
        screenbuffer.setCursor(op[0], op[1])
      } else if (op.length == 3) {
        if (op[1] == 1) { /* copy */
          screenbuffer.update(op[0], backbuffer.getRow(op[2]))
        } else if (op[1] === 0) { /* resize */
          screenbuffer.setCols(op[0], op[2])
        }
      } else if (op.length == 4) {
        draw(op[0], op[1], op[2], uncompress(op[3]))
      }
    })

    function draw(row, col, text, attrs) {
      for (var i = 0; i < text.length; i ++) {
        screenbuffer.setCell(row, col + i, [attrs[i], text.charAt(i)])
      }
    }

  }

  function uncompress(str) {
    var out = []
    str.split(',').forEach(function(text) {
      var item = text.split('*')
      var count = parseInt(item[1], 10) || 1
      for (var i = 0; i < count; i ++) out.push(parseInt(item[0], 10))
    })
    return out
  }

  if (typeof module != 'undefined') module.exports = patch

  /*global ScreenBuffer*/
  if (typeof ScreenBuffer != 'undefined') { ScreenBuffer.patch = patch }

}()




