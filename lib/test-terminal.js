#!/usr/bin/env node

var HeadlessTerminal = require('./headless-terminal')

var term = new HeadlessTerminal(80, 25)
term.open()

process.stdin.resume()
process.stdin.on('data', function(buf) {
  var str = buf.toString('utf8')
  try {
    term.write(str)
  } catch (e) {
  }
})
process.stdin.on('end', function() {
  console.log('died')
  process.exit(1)
})

