function Console(aId) {
    this.id = aId;
    this.cursor = 0;
    this.clear();
    
    var that = this;
    window.addEventListener('keydown', function (event) {
        that.keyDown(event);
        event.preventDefault();
    }, false);
}
Console.prototype = {
    COLS: 80,
    ROWS: 24,

    clear: function () {
        this.buffer = '';
        for (var i = 0; i < this.COLS * this.ROWS; ++i) {
            this.buffer += ' ';
        }
        this.cursor = 0;
        this.update();
    },
    update: function () {
        var lines = [];
        for (var i = 0; i < this.ROWS; ++i) {
            lines.push(this.buffer.substr(i * this.COLS, this.COLS));
        }
        var pre = document.getElementById(this.id);
        pre.innerHTML = lines.join('\n');
    },
    print: function (aString, aNewLine, aInsert) {
        var max = this.ROWS * this.COLS;
        var n = aInsert ? 0 : aString.length;
        var front = this.buffer.substring(0, this.cursor);
        var rear  = this.buffer.substring(this.cursor + n, max);
        this.buffer = front + aString + rear;
        if (aInsert) {
            this.buffer = this.buffer.substring(0, max);
        }
        if (aNewLine) {
            this.locate(0, this.getY() + 1);
        } else {
            this.cursor += aString.length;
        }
        this.update();
    },
    backspace: function () {
        --this.cursor;
        var max = this.ROWS * this.COLS;
        var front = this.buffer.substring(0, this.cursor);
        var rear  = this.buffer.substring(this.cursor + 1, max);
        this.buffer = front + ' ' + rear;
        this.update();
    },
    getX: function () {
        return this.cursor % this.COLS;
    },
    getY: function () {
        return (this.cursor / this.COLS) | 0;
    },
    locate: function (x, y) {
        this.cursor = x + y * this.COLS;
    },
    getCursorLine: function () {
        return this.buffer.substr(this.COLS * this.getY(), this.COLS);
    },
    keyDown: function (aEvent) {
        switch (aEvent.key) {
        case 'ArrowUp':
        case 'UIKeyInputUpArrow':
            //this.locate(this.getX(), this.getY() - 1);
            break;
        case 'ArrowLeft':
        case 'UIKeyInputLeftArrow':
            this.locate(this.getX() - 1, this.getY());
            break;
        case 'ArrowRight':
        case 'UIKeyInputRightArrow':
            this.locate(this.getX() + 1, this.getY());
            break;
        case 'ArrowDown':
        case 'UIKeyInputDownArrow':
            //this.locate(this.getX(), this.getY() + 1);
            break;
        case 'Enter':
            var line = this.getCursorLine();
            this.print('', true);
            parseLine(line, true);
            break;
        case 'Backspace':
            if (this.getX() > 0) {
                this.backspace();
            }
            break;
        case 'Shift':
        case 'Dead':
            break;
        default:
            this.print(aEvent.key, false, true);
        }
    },
};