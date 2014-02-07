
var spawn = require("child_process").spawn
var child = spawn('node', ["app.js"])

child.stderr.pipe(process.stderr)
child.stdout.pipe(process.stdout)
child.stdin.write('h\033[1mello \033[38;5;20mworld!!')

