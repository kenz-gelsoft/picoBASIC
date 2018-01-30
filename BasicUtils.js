function CLS() {
    var console = document.getElementById('console');
    console.innerHTML = '';
}
function PUT(aText) {
    var console = document.getElementById('console');
    console.innerHTML += aText + '\n';
}
function CHR(c) {
    if (c == null) {
        return -1;
    }
    return c.charCodeAt(0);
}
