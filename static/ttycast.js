
/*global DisplayBuffer, ScreenBuffer, io*/
window.onload = function() {

  var el = document.getElementById('terminal')
    , buf = new DisplayBuffer(el)

  var socket = io.connect()
  socket.on('terminal-data', function(operations) {
    ScreenBuffer.patch(buf, operations)
  })

}
