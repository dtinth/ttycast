
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

/**
 * Make the content of the "target" buffer match with the "source".
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

    // find the amount of change
    var min = null, max = null
    for (var i = 0; i < cols; i ++) {
      if (!cellEquals(source.getCell(row, i), target.getCell(row, i))) {
        if (min == null) min = i
        max = i
      }
    }

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
