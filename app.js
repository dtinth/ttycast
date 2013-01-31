#!/usr/bin/env node

var connect = require('connect')
  , app = connect.createServer()
  , server = require('http').createServer(app)
  , path = require('path')
  , send = require('send')
  , HeadlessTerminal = require('./lib/headless-terminal')
  , term = new HeadlessTerminal(80, 25)
  , bufferPath = require.resolve('./lib/screen-buffer')

var io = require('socket.io').listen(server)
io.set('log level', 2)

app.use(connect.static(__dirname + '/static'))

app.use('/screen-buffer.js', function(req, res, next) {
  send(req, '/' + path.basename(bufferPath)).root(path.dirname(bufferPath))
    .pipe(res)
})

process.stdin.resume()

process.stdin.on('data', function(buf) {
  var str = buf.toString('utf8')
  try { term.write(str) } catch (e) { }
})

term.on('screen', function(operations) {
  io.sockets.emit('data', operations)
})

process.stdin.on('end', function() {
  console.log('died')
  process.exit(1)
})

io.sockets.on('connection', function(sock) {
  sock.emit('data', term.getInitialOperations())
})

server.listen(Number(process.env.PORT) || 13377)

