ttycast: broadcast your tty!
============================

This app allows you to broadcast your tty online!

This NodeJS app is powered by tty.js, ttyrec (and ttyplay), socket.io and connect.

<img src="http://i.imgur.com/7aRYM.png" alt="ttycast">

Prerequisites
-------------

Install ttyrec:

    brew install ttyrec

Install ttycast:

    npm install -g ttycast


Running
-------

In your favorite terminal emulator, spawn a new window, and then to start recording:

    reset && ttyrec /tmp/ttyr

Now on your old window, run `ttyplay -p` and pipe it to ttycast!

    ttyplay -p /tmp/ttyr | ttycast

And go to

    http://localhost:13377/


Changing Port
-------------

ttycast uses the PORT environment variable but the default port is 13377



Piping Via SSH
--------------

You can install ttycast on your server somewhere, and pipe your
local terminal there through SSH!

Good when you are behind a firewall.

    ttyplay -p /tmp/ttyr | ssh myserver.dt.in.th PORT=12345 ttycast


License
-------

The MIT license
