#!/usr/bin/env node

// parse the command line
var program = require('commander')

program
  .option('-r, --rows <n>', 'Number of rows in the broadcasting terminal', parseInt, 25)
  .option('-c, --columns <n>', 'Number of columns in the broadcasting terminal', parseInt, 80)
  .option('-s, --size <CxR>', 'Size of the terminal (shorthand for combination of -c and -r)')
  .option('-C, --current', 'Use the current terminal\'s size')
  .parse(process.argv)

var rows = program.rows
  , cols = program.columns

if (program.size) {
  var m = program.size.match(/^(\d+)x(\d+)$/i)
  if (!m) {
    console.log('Invalid size specified! Must be in form CxR')
    program.help()
  }
  cols = parseInt(m[1], 10)
  rows = parseInt(m[2], 10)
}

if (program.current) {
  rows = process.stdout.rows
  cols = process.stdout.columns
}

// create the server and require other libraries
var connect = require('connect')
  , app = connect.createServer()
  , server = require('http').createServer(app)
  , path = require('path')
  , send = require('send')
  , HeadlessTerminal = require('headless-terminal')
  , ScreenBuffer = HeadlessTerminal.ScreenBuffer


// create socket.io server
var io = require('socket.io').listen(server)
io.set('log level', 1)


// serve static files
app.use(connect.static(__dirname + '/static'))


// create a terminal emulator
var term = new HeadlessTerminal(cols, rows)
console.log('creating a terminal: %dx%d', cols, rows)

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
  io.sockets.emit('data', ScreenBuffer.diff(new ScreenBuffer(), buffer))
})

// when the terminal's screen buffer is changed,
// we patch our buffer to match with the terminal's buffer,
// and broadcast the patch
var timeout = null
  , jsonSize = 0
term.on('change', function() {
  if (timeout == null) timeout = setTimeout(broadcast, 1000 / 30)
})


function broadcast() {
  timeout = null
  
  var operations = ScreenBuffer.diff(buffer, term.displayBuffer)
  if (operations.length === 0) return

  io.sockets.emit('data', operations)
  ScreenBuffer.patch(buffer, operations)
}


// listen
server.listen(Number(process.env.PORT) || 13377, function() {
  var address = server.address()
  console.log('ttycast listening on %s port %s', address.address, address.port)
})

