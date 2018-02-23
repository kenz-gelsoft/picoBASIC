function CLS() {
    console.clear();
}
function PUT(aText) {
    console.print(aText, true);
}
function LOCATE(x, y) {
    console.locate(x, y);
}
function ASC(c) {
    if (c == null) {
        return -1;
    }
    return c.charCodeAt(0);
}
