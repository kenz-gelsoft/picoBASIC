function Console(aId) {
    this.id = aId;
    this.cursor = 0;
    this.clear();
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
    print: function (aString) {
        var max = this.ROWS * this.COLS;
        var front = this.buffer.substring(0, this.cursor);
        var rear  = this.buffer.substring(this.cursor, max);
        this.buffer = front + aString + rear;
        this.buffer = this.buffer.substring(0, max);
        this.update();
    },
    locate: function (x, y) {
        this.cursor = x + y * this.COLS;
    },
};