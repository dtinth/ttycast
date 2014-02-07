
var spawn = require("child_process").spawn
var child = spawn('node', ["app.js"])

child.stderr.pipe(process.stderr)
child.stdout.pipe(process.stdout)
child.stdin.write('\n === h\033[1mello \033[38;5;20mworld!! ===\n\n\rsupercalifragilisticexpialidocious!!!\rit seems like ttycast is at least somehow working!\ni am happy.')

