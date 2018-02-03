var console = null;
function CLS() {
    console.clear();
}
function PUT(aText) {
    console.print(aText + '\n');
}
function LOCATE(x, y) {
    console.locate(x, y);
}
function CHR(c) {
    if (c == null) {
        return -1;
    }
    return c.charCodeAt(0);
}
