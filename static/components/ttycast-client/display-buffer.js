
/*global ScreenBuffer*/
function DisplayBuffer(el) {

  ScreenBuffer.call(this)
  var buf = this

  // overrides
  var update = buf.update
    , setCell = buf.setCell
    , setCursor = buf.setCursor

  // private vars
  var dirty = {}
    , timeout = null
    , rows = []

  // override : when draw, mark the buffer dirty
  buf.update = function(row) {
    setDirty(row)
    return update.apply(this, arguments)
  }

  // override : when copy, mark the buffer dirty
  buf.setCell = function(row) {
    setDirty(row)
    return setCell.apply(this, arguments)
  }

  // override : when moving cursor, mark the buffer dirty
  buf.setCursor = function(x, y) {
    setDirty(this.cursorY)
    setDirty(y)
    return setCursor.apply(this, arguments)
  }

  // mark a row as dirty, get ready to refresh
  function setDirty(row) {
    dirty[row] = true
    if (timeout == null) timeout = setTimeout(refresh, 1)
  }

  // refresh the display
  function refresh() {
    var i
    timeout = null
    while (rows.length < buf.getRows()) {
      i = rows.length
      var rowElement = document.createElement('div')
      rowElement.className = 'row'
      el.appendChild(rowElement)
      rows[i] = rowElement
      dirty[i] = true
    }
    for (i = 0; i < buf.getRows(); i ++) {
      if (dirty[i]) {
        rows[i].innerHTML = render(i)
      }
    }
    dirty = {}
  }
  
  // render a single row, returns html
  function render(row) {
    var html = ''
    var cols = buf.getCols(row)
    var lastClass = null
    for (var i = 0; i < cols; i ++) {
      var cell = buf.getCell(row, i)
        , attr = cell[0]
        , ch = cell[1]
        , classes = []
      if (row == buf.cursorY && i == buf.cursorX) {
        classes.push('cursor')
      }
      if (attr == -1) {
        classes.push('inverse')
      } else {
        var bg = attr & 0x1ff
          , fg = (attr >> 9) & 0x1ff
          , flags = attr >> 18
        if (flags & 1) classes.push('bold')
        if (flags & 2) classes.push('underline')
        if (bg > 255) bg = 'default-bg'
        if (fg > 255) fg = 'default-fg'
        if (flags & 4) {
          var tmp = bg
          bg = fg
          fg = tmp
        }
        classes.push('bg-' + bg)
        classes.push('fg-' + fg)
      }
      var className = classes.join(' ')
      if (className != lastClass) {
        if (lastClass != null) html += '<\/span>'
        html += '<span class="' + className + '">'
        lastClass = className
      }
      if (ch == '&') html += '&amp;'
      else if (ch == '<') html += '&lt;'
      else if (ch == '>') html += '&gt;'
      else html += ch
    }
    if (lastClass != null) html += '<\/span>'
    return html
  }
}

DisplayBuffer.prototype = ScreenBuffer.prototype
