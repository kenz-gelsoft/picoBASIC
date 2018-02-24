class Console {
    constructor(aId) {
        this.id = aId;
        this.cursor = 0;
        this.clear();
        
        window.addEventListener('keydown', (event) => {
            this.keyDown(event);
        }, false);
    }
    get COLS()  { return 80; }
    get ROWS()  { return 24; }

    get DEBUG() { return true; }

    clear() {
        this.buffer = this.chars(' ', this.COLS * this.ROWS);
        this.cursor = 0;
        this.update();
    }
    update() {
        while (this.getY() >= this.ROWS) {
            this.scroll();
        }
        const lines = [];
        for (let i = 0; i < this.ROWS; ++i) {
            lines.push(this.buffer.substr(i * this.COLS, this.COLS));
        }
        const pre = document.getElementById(this.id);
        pre.innerHTML = lines.join('\n');
        //this.debug();
    }
    scroll() {
        this.buffer = this.buffer.substring(this.COLS);
        this.buffer += this.chars(' ', this.COLS);
        this.cursor -= this.COLS;
    }
    chars(char, count) {
        let s = '';
        for (let i = 0; i < count; ++i) {
            s += char;
        }
        return s;
    }
    debug() {
        let msg = '';
        const items = [
            ['cursor', this.cursor],
            ['x', this.getX()],
            ['y', this.getY()],
        ].forEach((item) => {
            msg += item.join('=') + '\n';
        });
        document.getElementById('debug').innerHTML = msg;
    }
    print(aString, aNewLine=false, aInsert=false) {
        aString = aString.toString();
        const max = this.ROWS * this.COLS;
        const n = aInsert ? 0 : aString.length;
        const front = this.buffer.substring(0, this.cursor);
        const rear  = this.buffer.substring(this.cursor + n, max);
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
    }
    backspace() {
        --this.cursor;
        const max = this.ROWS * this.COLS;
        const front = this.buffer.substring(0, this.cursor);
        const rear  = this.buffer.substring(this.cursor + 1, max);
        this.buffer = front + ' ' + rear;
        this.update();
    }
    getX() {
        return this.cursor % this.COLS;
    }
    getY() {
        return (this.cursor / this.COLS) | 0;
    }
    locate(x, y) {
        this.cursor = x + y * this.COLS;
    }
    getCursorLine() {
        return this.buffer.substr(this.COLS * this.getY(), this.COLS);
    }
    parseLine(aLine) {
        if (this.DEBUG) {
            parseLine(aLine, true);
            return;
        }
        try {
            parseLine(line, true);
        } catch (e) {
            PUT('Syntax error');
        }
    }
    keyDown(aEvent) {
        const modifiersToIgnore = [
            'Alt', 'Control', 'Meta',
        ];
        const keysToIgnore = [
            'Shift', 'Dead', 'F5',
        ];
        for (const modifier of modifiersToIgnore) {
            if (aEvent.getModifierState(modifier)) {
                return;
            }
        }
        if (modifiersToIgnore.includes(aEvent.key) ||
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
            const line = this.getCursorLine();
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
    }
}
