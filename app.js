#!/usr/bin/env node

// parse the command line
var program = require('commander')

program
  .option('-r, --rows', 'Number of rows in the broadcasting terminal')
  .option('-c, --cols', 'Number of columns in the broadcasting terminal')
  .parse(process.argv)

var rows = program.rows || 80
  , cols = program.cols || 25


// create the server and require other libraries
var connect = require('connect')
  , app = connect.createServer()
  , server = require('http').createServer(app)
  , path = require('path')
  , send = require('send')
  , ScreenBuffer = require('./lib/screen-buffer')
  , patcher = require('./lib/buffer-patcher')


// create socket.io server
var io = require('socket.io').listen(server)
io.set('log level', 2)


// serve static files
app.use(connect.static(__dirname + '/static'))

// serve the screen buffer library
var bufferPath = require.resolve('./lib/screen-buffer')
app.use('/screen-buffer.js', function(req, res, next) {
  send(req, '/' + path.basename(bufferPath)).root(path.dirname(bufferPath))
    .pipe(res)
})


// create a terminal emulator
var HeadlessTerminal = require('./lib/headless-terminal')
  , term = new HeadlessTerminal(80, 25)

// pipe the data to this terminal
term.open()
process.stdin.resume()
process.stdin.on('data', function(buf) {
  var str = buf.toString('utf8')
  try { term.write(str) } catch (e) { console.log(e); console.log(e.stack) }
})
process.stdin.on('end', function() {
  console.log('died')
  process.exit(1)
})


// the display as seen by clients
var buffer = new ScreenBuffer()

// when a client is connected, it is initialized with an empty buffer.
// we patch its buffer to our current state
io.sockets.on('connection', function(sock) {
  var client = new ScreenBuffer()
  io.sockets.emit('data', patcher.patch(client, buffer))
})

// when the terminal's screen buffer is changed,
// we patch our buffer to match with the terminal's buffer,
// and broadcast the patch
var timeout = null
term.on('change', function() {
  if (timeout == null) timeout = setTimeout(broadcast, 1000 / 30)
})
function broadcast() {
  timeout = null
  io.sockets.emit('data', patcher.patch(buffer, term.displayBuffer))
}


// listen
server.listen(Number(process.env.PORT) || 13377)

