
void function() {

  // ## ScreenBuffer Diff and Patch
  //
  // Sometimes, you may want to stream the content of a screen buffer
  // over the network.
  //
  // You can use `ScreenBuffer.diff` and `ScreenBuffer.patch` for this.
  //
  // Suppose that you have two ScreenBuffer objects, `a` and `b`,
  //
  // ```javascript
  // var operations = ScreenBuffer.diff(b, a)
  // ```
  //
  // This will compute the operations that needs to be done on `b`
  // to make its contents equal to `a`.
  // The returned result is an array of operations,
  // which can be sent over the wire to another user.
  //
  // At the other side,
  // when they received the operations,
  // they can apply it to their own buffer like this:
  //
  // ```javascript
  // ScreenBuffer.patch(b, operations)
  // ```
  //
  //
  // ### ScreenBuffer.diff(source, destination)
  //
  // Computes the list of operation _to be applied on the source_
  // to make it match the target.
  //
  // A returned result will have this structure:
  //
  // ```javascript
  // [OPERATION, ...]
  // ```
  //
  // An _OPERATION_ represents an operation:
  //
  // * `ROWS` (resize number of rows)
  // * `[X, Y]` (set cursor position)
  // * `[row, 0, COLUMNS]` (resize column)
  // * `[row, 1, SOURCE ROW INDEX]` (copy)
  // * `[row, column, "TEXT", "COMPRESSED ATTRIBUTE,..."]` (draw text)
  //
  // A _COMPRESSED ATTRIBUTE_ has the form:
  //
  // * `VALUE`
  // * `VALUE*MULTIPLICITY`
  //
  function diff(source, target) {

    var operations = [ ]
    var rows = target.getRows()

    /* resize rows */
    if (rows < source.getRows()) {
      operations.push(rows)
    }

    /* now, compute the operations for each row */
    for (var i = 0; i < rows; i ++) {
      diffRow(i)
    }

    /* finally, move the cursor */
    if (source.cursorX != target.cursorX || source.cursorY != target.cursorY) {
      operations.push([target.cursorX, target.cursorY])
    }

    return operations

    function diffRow(i) {

      var cols = target.getCols(i)

      /* search nearby rows that are most similar */
      var candidate = null

      /* get the rows that we can try */
      var toTry = [i, i - 1, i + 1, i - 2, i + 2, i - 3, i + 3]
            .filter(function(k) { return 0 <= k && k < source.getRows() })

      /* for each possible rows to try, compute the difference between rows */
      for (var j = 0; j < toTry.length; j ++) {

        var k = toTry[j]

        var challenger = getDifferences(i, k, cols)
        if (candidate == null || challenger.changes < candidate.changes) {
          candidate = challenger
        }

        /* stop if found a perfect match */
        if (candidate.changes === 0) {
          break
        }

      }

      /* if we can't find any similar row, take itself! */
      if (candidate == null) {
        candidate = { copyFrom: i, left: 0, right: cols - 1 }
      }

      /* finally, we add operation */
      applyRowOperation(candidate, i, cols)

    }

    function getDifferences(destination, copyFrom, cols) {
      var left, right, changes
      for (var i = 0; i < cols; i ++) {
        if (!equals(target.getCell(destination, i), source.getCell(copyFrom, i))) {
          if (left == null) left = i
          right = i
        }
      }
      changes = left == null ? 0 : right - left + 1
      return { copyFrom: copyFrom, left: left, right: right, changes: changes }
    }

    function applyRowOperation(op, i, cols) {
      if (op.copyFrom != i) operations.push([i, 1, op.copyFrom])
      if (cols < source.getCols(op.copyFrom)) operations.push([i, 0, cols])
      if (op.left == null) return
      var text = ''
      var attributes = []
      for (var j = op.left; j <= op.right; j ++) {
        var cell = target.getCell(i, j)
        text += cell[1]
        attributes.push(cell[0])
      }
      if (text !== '') {
        operations.push([i, op.left, text, compress(attributes)])
      }
    }

  }

  function compress(attributes) {
    var out = []
    var i = 0
    while (i < attributes.length) {
      var t = attributes[i]
      var count = 0
      while (i < attributes.length && attributes[i] == t) {
        i += 1
        count += 1
      }
      out.push(count == 1 ? t : t + '*' + count)
    }
    return out.join(',')
  }

  function equals(a, b) {
    return a[0] == b[0] && a[1] == b[1]
  }

  if (typeof module != 'undefined') module.exports = diff

  /*global ScreenBuffer*/
  if (typeof ScreenBuffer != 'undefined') { ScreenBuffer.diff = diff }

}()




