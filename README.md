ttycast: broadcast your tty!
============================

This app allows you to broadcast your tty online, in really real time! Powered by:

 * [headless-terminal](https://github.com/dtinth/headless-terminal) - headless
   terminal emulator, forked from [tty.js](https://github.com/chjj/tty.js).
 * [socket.io](http://socket.io/) - for real time communication
 * [ttyrec](http://0xcc.net/ttyrec/index.html.en) - a tty recorder (and the [JavaScript port](https://github.com/jedi4ever/ttyrec.js))
 * and also thanks to [Connect](http://www.senchalabs.org/connect/).

<img src="http://i.imgur.com/YBobVKm.png" alt="ttycast">


Prerequisites
-------------

Install ttyrec and ttycast:

    npm install -g ttyrec ttycast

* The above command installs the [JavaScript port of ttyrec](https://github.com/jedi4ever/ttyrec.js), which is fairly new. If it does not work, you can also try the [native ttyrec](http://0xcc.net/ttyrec/index.html.en), which is available in most package managers (apt-get, Homebrew, ...).


Running (Broadcast & Record)
-------

First, set your terminal to the size that you prefer to broadcast, then run the script:

    ttyreccast outfile.tty

Open your browser and navigate to the server. You should see a blank black screen.

    http://localhost:13377/

Then, open a new terminal of __the same size__ and run this command:

    reset && ttyrec /tmp/ttycast

You should see your terminal screen on the web browser now. Recorded output goes into `outfile.tty`.



Changing Port
-------------

ttycast uses the PORT environment variable but the default port is 13377



Running (manual way)
--------------------

In your terminal emulator, create a named pipe and pipe it using `ttyplay -n` to ttycast.

    mkfifo /tmp/ttycast && ttyplay -n /tmp/ttycast | ttycast -s 80x25; rm /tmp/ttycast

Open your browser and navigate to the server.

    http://localhost:13377/

Then, spawn a new 80x25 terminal window and start recording:

    reset && ttyrec /tmp/ttycast

Then you should see characters appearing in real-time. After using, don't forget to `rm /tmp/ttycast`!



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


