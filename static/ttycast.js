
/*global DisplayBuffer, ScreenBuffer, io*/
window.onload = function() {

  var el = document.getElementById('terminal')
    , buf = new DisplayBuffer(el)

  var socket = io.connect()
  socket.on('data', function(operations) {
    console.log(uneval(operations))
    ScreenBuffer.patch(buf, operations)
  })

}
