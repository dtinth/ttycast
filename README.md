ttycast: broadcast your tty!
============================

This app allows you to broadcast your tty online!

This NodeJS app is powered by tty.js, ttyrec (and ttyplay), socket.io and connect.


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
