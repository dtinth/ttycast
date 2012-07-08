ttycast: broadcast your tty!
============================

This app allows you to broadcast your tty online, in really real time!

This Node.js app is very simple (less than 80 lines of my own code),
by putting a lot of libraries together. So, this app wouldn't be possible without:

* [tty.js](https://github.com/chjj/tty.js) - terminal emulator in pure javascript
* [socket.io](http://socket.io/) - for real time communication
* [ttyrec](http://0xcc.net/ttyrec/index.html.en) - a tty recorder
* and also thanks to [Connect](http://www.senchalabs.org/connect/).

This NodeJS app is powered by tty.js, ttyrec (and ttyplay), socket.io and connect.

An online version of this app is available at <http://tty.hacked.jp>.
It uses `ttyrec` and `nc`, no Node.js required on the client.
The modified source code will be released sometime after.

<img src="http://i.imgur.com/7aRYM.png" alt="ttycast">



Prerequisites
-------------

Install ttyrec:

    brew install ttyrec

Install ttycast:

    npm install -g ttycast

Also, your terminal must be 80x25. But you can change that size in `index.html`.

Running
-------

In your terminal emulator, create a named pipe and pipe it using `ttyplay -n` to ttycast.

    mkfifo /tmp/ttycast
    ttyplay -n /tmp/ttycast | ttycast

Open your browser and navigate to the server.

    http://localhost:13377/

Then, spawn a new 80x25 terminal window and start recording:

    reset && ttyrec /tmp/ttycast

Then you should see characters appearing in real-time. After using, don't forget to `rm /tmp/ttycast`!

(not working? Then try using normal files. Scroll all the way down.)



Changing Port
-------------

ttycast uses the PORT environment variable but the default port is 13377



Piping Via SSH
--------------

You can install ttycast on your server somewhere, and pipe your
local terminal there through SSH!

Good when you are behind a firewall.

    ttyplay -n /tmp/ttycast | ssh myserver.dt.in.th PORT=12345 ttycast



Pipe Anything
-------------

Um you can pipe anything that a terminal can understand to ttycast, and it will be broadcasted.

    brew install sl
    { while true; do sl 2>&1; done } | ttycast

<img src="http://i.imgur.com/7pQoN.png" alt="sl!!">






License
-------

The MIT license


----

Normal File Usage
-----------------

In your favorite terminal emulator, spawn a new window, and then to start recording:

    reset && ttyrec /tmp/ttyr

Now on your old window, run `ttyplay -p` and pipe it to ttycast!

    ttyplay -p /tmp/ttyr | ttycast

And go to

    http://localhost:13377/

