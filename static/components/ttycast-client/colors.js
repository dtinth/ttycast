
;(function() {

  var css = ''

  // from tty.js
  var colors = [
    '#2e3436', '#cc0000', '#4e9a06', '#c4a000', '#3465a4', '#75507b', '#06989a', '#d3d7cf',
    '#555753', '#ef2929', '#8ae234', '#fce94f', '#729fcf', '#ad7fa8', '#34e2e2', '#eeeeec'
  ]

  // these colors i like more --dtinth
  colors = [
    "#000000", "#c83a14", "#6ed100", "#bbbb00", "#1d81e1", "#ad30ed", "#249aaf", "#bbbbbb",
    "#555555", "#f77b5a", "#a0ee00", "#f6f500", "#59bbf3", "#f458d6", "#7cf2ff", "#ffffff"
  ]

  // Much thanks to TooTallNate for writing this.
  var r = [0x00, 0x5f, 0x87, 0xaf, 0xd7, 0xff]
    , i;

  // 16-231
  i = 0;
  for (; i < 216; i++) {
    out(r[(i / 36) % 6 | 0], r[(i / 6) % 6 | 0], r[i % 6]);
  }

  // 232-255 (grey)
  i = 0;
  for (; i < 24; i++) {
    r = 8 + i * 10;
    out(r, r, r);
  }

  function out(r, g, b) {
    colors.push('#' + hex(r) + hex(g) + hex(b));
  }

  function hex(c) {
    c = c.toString(16);
    return c.length < 2 ? '0' + c : c;
  }

  function color(i, bg, fg) {
    css += '.terminal .bg-' + i + ' { background-color: ' + bg + '; }\n'
    css += '.terminal .fg-' + i + ' { color: ' + fg + '; }\n'
  }

  for (i = 0; i < colors.length; i ++) {
    color(i, colors[i], colors[i])
  }
  color('default-bg', '#000000', '#000000')
  color('default-fg', '#f0f0f0', '#f0f0f0')

  for (i = 0; i < 8; i ++) {
    css += '.terminal .bold.fg-' + i + ' { color: ' + colors[i + 8] + '; }\n'
  }

  document.write('<style>' + css + '<\/style>')

})()

