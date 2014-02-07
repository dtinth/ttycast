
var system = require('system')
var spawn = require("child_process").spawn
var child = spawn("node", ["harness/server.js"])

child.stderr.on('data', function(data) {
  console.log('stderr from server: ' + data)
})

child.stdout.on('data', function(data) {
  console.log('stdout from server: ' + data)
})

child.on('exit', function() {
  phantom.exit(1)
})

setTimeout(startTest, 1000)


var page

function startTest() {
  page = require('webpage').create()
  var url = 'http://localhost:' + system.env.PORT
  console.log('Going to ' + url)
  page.open(url, function() {
    setTimeout(check, 1000)
  })
}

function check() {
  var text = page.evaluate(function() {
    return document.body.textContent
  })
  if (text.indexOf('hello world!!') == -1) {
    console.error('Something is wrong!')
    phantom.exit(1)
  } else {
    console.log(text.trim())
    phantom.exit(0)
  }
}


