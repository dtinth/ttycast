
/**
 * Makes the content of the "target" buffer match with the "source".
 * It returns the list of operations needed for this to happen.
 * It tries to make this list of operation as small as possible.
 */
exports.patch = function(target, source) {
  var ops = []

  // runs a command on the target and logs it
  function execute() {
    var command = [].slice.call(arguments)
    ops.push(command)
    target[command[0]].apply(target, command.slice(1))
  }

  // performs a patch on a row
  function row(row) {

    // match the column count
    var cols = source.getCols(row)
    if (target.getCols(row) != cols) execute('setCols', row, cols)

    // find the row that match the new content the best (good when scrolling)
    ;(function() {

      // look 5 rows below
      var minChanges = null, best
      for (var r = row; r < row + 5 && r < source.getRows(); r++) {
        if (target.getCols(r) == cols) {

          // scan the differences
          var cMin = null, cMax = null, changes
          for (var i = 0; i < cols; i ++) {
            if (!cellEquals(source.getCell(row, i), target.getCell(r, i))) {
              if (cMin == null) cMin = i
              cMax = i
            }
          }
          changes = (cMin == null ? 0 : cMax - cMin + 1)

          // if this row is better as a source, then make it the "best source row"
          if (best == null || changes < minChanges) {
            minChanges = changes
            best = r
            min = cMin
            max = cMax
            if (changes == 0) break
          }

        }
      }

      // the best source row is not current row, so we copy them here
      if (best != row) {
        execute('copy', row, best)
      }

    })()


    // no change? do nothing
    if (min == null) return


    // generate draw command
    var text = ''
      , attrs = []
    for (var i = min; i <= max; i ++) {
      var cell = source.getCell(row, i)
      text += cell[1]
      attrs.push(cell[0])
    }
    execute('draw', row, min, text, compress(attrs))

  }

  // match row count
  var rows = source.getRows()
  if (target.getRows() != rows) {
    execute('setRows', rows)
  }

  // process each row
  for (var i = 0; i < rows; i ++) {
    row(i)
  }

  // match cursor position
  execute('setCursor', source.cursorX, source.cursorY)

  return ops

}

function cellEquals(a, b) {
  return a[0] == b[0] && a[1] == b[1]
}

function compress(a) {
  var o = []
  for (var i = 0; i < a.length; i += count) {
    var count = 1
    for (var j = i + 1; j < a.length; j ++) {
      if (a[i] == a[j]) {
        count ++
      } else {
        break
      }
    }
    o.push([a[i], count])
  }
  return o
}

