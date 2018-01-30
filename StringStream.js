function StringStream(aString) {
    this.string = aString;
    this.index = 0;
}
StringStream.prototype = {
    getc: function () {
        if (this.string.length == this.index) {
            return null; // EOF
        }
        return this.string.charAt(this.index++);
    },
    back: function () {
        this.index--;
    },
};
