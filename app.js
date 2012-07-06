#!/usr/bin/env node

var connect = require('connect')
  , app = connect.createServer()
  , server = require('http').createServer(app)
  , path = require('path')
  , termPath = require.resolve('tty.js/static/term')

var io = require('socket.io').listen(server)
io.set('log level', 2)
var past = ''
app.use(connect.static(__dirname + '/static'))
app.use('/term', function(req, res, next) {
  connect.static.send(req, res, next, {
    root: path.dirname(termPath)
  , getOnly: true
  , path: '/' + path.basename(termPath)
  })
})

//var play = spawn('ttyplay', [ '-p', process.argv[2] ])
process.stdin.resume()
process.stdin.on('data', function(buf) {
  var str = buf.toString('utf8')
  past += str
  var idx = past.lastIndexOf('\x1b\x5b\x48\x1b\x5b\x32\x4a')
  if (~idx) {
    past = past.substr(idx)
  }
  io.sockets.emit('data', str)
  console.log('past size: ' + past.length)
})
process.stdin.on('end', function() {
  console.log('died')
  process.exit(1)
})
io.sockets.on('connection', function(sock) {
  sock.emit('data', past)
})

server.listen(Number(process.env.PORT) || 13377)

