ttycast: broadcast your tty!
============================

This app allows you to broadcast your tty online, in really real time! Powered by:

 * [headless-terminal](https://github.com/dtinth/headless-terminal) - headless
   terminal emulator, forked from [tty.js](https://github.com/chjj/tty.js).
 * [socket.io](http://socket.io/) - for real time communication
 * [ttyrec](http://0xcc.net/ttyrec/index.html.en) - a tty recorder
 * and also thanks to [Connect](http://www.senchalabs.org/connect/).

<img src="http://i.imgur.com/YBobVKm.png" alt="ttycast">


Prerequisites
-------------

Install ttyrec. On Mac OS X, with Homebrew, you would do:

    brew install ttyrec

On Ubuntu, you can do:

    sudo apt-get install ttyrec

Install ttycast:

    npm install -g ttycast



Running
-------

In your terminal emulator, create a named pipe and pipe it using `ttyplay -n` to ttycast.

    mkfifo /tmp/ttycast && ttyplay -n /tmp/ttycast | ttycast -s 80x25; rm /tmp/ttycast

Open your browser and navigate to the server.

    http://localhost:13377/

Then, spawn a new 80x25 terminal window and start recording:

    reset && ttyrec /tmp/ttycast

Then you should see characters appearing in real-time. After using, don't forget to `rm /tmp/ttycast`!

(not working? Then try using normal files. Scroll all the way down.)



Changing Port
-------------

ttycast uses the PORT environment variable but the default port is 13377


Changing Terminal Size
----------------------

Just change the `-s` switch from `80x25` to something else. Make sure it matches with the terminal you're using.


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


