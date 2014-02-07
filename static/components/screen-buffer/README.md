ScreenBuffer
============
A ScreenBuffer represents a visible portion of a terminal in a screen.
A ScreenBuffer contains a lot of cells.
Each cell contains a character and attributes,
such as color and boldness.
It also keeps track of cursor position.

## Cell Attributes

Currently the attributes is a 21-bit integer. From MSB:

 * 1 bit - inverse video flag
 * 1 bit - underline flag
 * 1 bit - bold flag
 * 9 bits - foreground color (according to xterm-256)
 * 9 bits - background color (according to xterm-256)

There are two special values for colors:

 * 257 - default foreground color
 * 256 - default background color
 
## API

### update(y, [ [attr, char], [attr, char], ... ]) 

Set one line of data in the ScreenBuffer.
y is the row in the screen and data array looks like this:
    [ [attribute, character], ... ]

### toString()

Returns the string in the display buffer.

### setCursor(x, y)

Sets the cursor position.

### cursorX

The X position of the cursor.

### cursorY

The Y position of the cursor.

### getRows()

Returns the number of rows in the buffer.

### getCols(row)

Returns the number of characters in this row.

### setRows(rows)

Resizes the number of rows.

### setCols(row, cols)

Resizes the number of columns in the specified row.

### getCell(row, col)

Returns the cell at (row, col).
Returned value is in form of [ attributes, ch ].

### setCell(row, col, cell)

Sets the cell at (row, col). A cell is in form of [ attributes, ch ].

### resize(rows, cols)

Resizes the screen buffer.

### clone()

Returns a clone of the screen buffer.

### getRow(row)

Returns a row data array. _Don't modify it!_

## ScreenBuffer Diff and Patch

Sometimes, you may want to stream the content of a screen buffer
over the network.

You can use `ScreenBuffer.diff` and `ScreenBuffer.patch` for this.

Suppose that you have two ScreenBuffer objects, `a` and `b`,

```javascript
var operations = ScreenBuffer.diff(b, a)
```

This will compute the operations that needs to be done on `b`
to make its contents equal to `a`.
The returned result is an array of operations,
which can be sent over the wire to another user.

At the other side,
when they received the operations,
they can apply it to their own buffer like this:

```javascript
ScreenBuffer.patch(b, operations)
```


### ScreenBuffer.diff(source, destination)

Computes the list of operation _to be applied on the source_
to make it match the target.

A returned result will have this structure:

```javascript
[OPERATION, ...]
```

An _OPERATION_ represents an operation:

* `ROWS` (resize number of rows)
* `[X, Y]` (set cursor position)
* `[row, 0, COLUMNS]` (resize column)
* `[row, 1, SOURCE ROW INDEX]` (copy)
* `[row, column, "TEXT", "COMPRESSED ATTRIBUTE,..."]` (draw text)

A _COMPRESSED ATTRIBUTE_ has the form:

* `VALUE`
* `VALUE*MULTIPLICITY`

### ScreenBuffer.patch(screenbuffer, operations)

Applies the operations from the diff array onto the screenbuffer.

