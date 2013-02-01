#!/usr/bin/env node

// require the libraries
var connect = require('connect')
  , app = connect.createServer()
  , server = require('http').createServer(app)
  , path = require('path')
  , send = require('send')

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

// broadcast the changes to the screen buffer to all clients
term.on('screen', function(operations) {
  io.sockets.emit('data', operations)
})

// send the initial data to newly-connected client
io.sockets.on('connection', function(sock) {
  sock.emit('data', term.getInitialOperations())
})

// listen
server.listen(Number(process.env.PORT) || 13377)

