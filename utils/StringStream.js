class StringStream {
    constructor(aString) {
        this.string = aString;
        this.index = 0;
    }
    getc() {
        if (this.string.length == this.index) {
            return null; // End of Stream
        }
        return this.string.charAt(this.index++);
    }
    back() {
        this.index--;
    }
}
