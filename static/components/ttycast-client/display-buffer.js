
function DisplayBuffer(el) {

  ScreenBuffer.call(this)
  var buf = this

  // overrides
  var draw = buf.draw
    , copy = buf.copy
    , setCursor = buf.setCursor

  // private vars
  var dirty = {}
    , timeout = null
    , rows = []

  // override : when draw, mark the buffer dirty
  buf.draw = function(row) {
    setDirty(row)
    return draw.apply(this, arguments)
  }

  // override : when copy, mark the buffer dirty
  buf.copy = function(row) {
    setDirty(row)
    return copy.apply(this, arguments)
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
    timeout = null
    while (rows.length < buf.getRows()) {
      var i = rows.length
      var rowElement = document.createElement('div')
      rowElement.className = 'row'
      el.appendChild(rowElement)
      rows[i] = rowElement
      dirty[i] = true
    }
    for (var i = 0; i < buf.getRows(); i ++) {
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
        classes.push('reverse-video')
      } else {
        var bg = attr & 0x1ff
          , fg = (attr >> 9) & 0x1ff
          , flags = attr >> 18
        if (flags & 1) classes.push('bold')
        if (flags & 2) classes.push('underline')
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
