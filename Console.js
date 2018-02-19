function Console(aId) {
    this.id = aId;
    this.cursor = 0;
    this.clear();
    
    var that = this;
    window.addEventListener('keydown', function (event) {
        that.keyDown(event);
    }, false);
}
Console.prototype = {
    COLS: 80,
    ROWS: 24,
    
    DEBUG: true,

    clear: function () {
        this.buffer = this.chars(' ', this.COLS * this.ROWS);
        this.cursor = 0;
        this.update();
    },
    update: function () {
        while (this.getY() >= this.ROWS) {
            this.scroll();
        }
        var lines = [];
        for (var i = 0; i < this.ROWS; ++i) {
            lines.push(this.buffer.substr(i * this.COLS, this.COLS));
        }
        var pre = document.getElementById(this.id);
        pre.innerHTML = lines.join('\n');
        //this.debug();
    },
    scroll: function () {
        this.buffer = this.buffer.substring(this.COLS);
        this.buffer += this.chars(' ', this.COLS);
        this.cursor -= this.COLS;
    },
    chars: function (char, count) {
        var s = '';
        for (var i = 0; i < count; ++i) {
            s += char;
        }
        return s;
    },
    debug: function () {
        var msg = '';
        var items = [
            ['cursor', this.cursor],
            ['x', this.getX()],
            ['y', this.getY()],
        ].forEach(function (item) {
            msg += item.join('=') + '\n';
        });
        document.getElementById('debug').innerHTML = msg;
    },
    print: function (aString, aNewLine, aInsert) {
        aString = aString.toString();
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
    parseLine: function (aLine) {
        if (this.DEBUG) {
            parseLine(aLine, true);
            return;
        }
        try {
            parseLine(line, true);
        } catch (e) {
            PUT('Syntax error');
        }
    },
    keyDown: function (aEvent) {
        var keysToIgnore = [
            'Shift', 'Dead',
            'Alt', 'Control',
            'F5'
        ];
        if (aEvent.getModifierState('Alt') ||
            aEvent.getModifierState('Control') ||
            keysToIgnore.includes(aEvent.key)) {
            return;
        }
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
            this.parseLine(line);
            break;
        case 'Backspace':
            if (this.getX() > 0) {
                this.backspace();
            }
            break;
        default:
            this.print(aEvent.key, false, true);
        }
        aEvent.preventDefault();
    },
};