window.addEventListener('load', function () {
    main();
}, false);

function main() {
    var doTranspile = document.getElementById('transpile');
    doTranspile.addEventListener('click', function () {
        transpile();
    }, false);
    var doTest = document.getElementById('test');
    doTest.addEventListener('click', function () {
        testTokenizer();
    }, false);
    PUT('Hello');
}
function transpile() {
    var src = document.getElementById('source').value;
    CLS();
    PUT(src);
}

var STATUS_BEGIN = 'begin';
var STATUS_END   = 'end';
