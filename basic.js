window.addEventListener('load', function () {
    main();
}, false);

var console = null;
function main() {
    console = new Console('console');
    
    PUT('picoBASIC version 0.0');
    PUT('COPYRIGHT (C) 2018 picoBASIC PROJECT.');
    PUT('Ok ');
}
function parseLine(aLine, aPrintOk) {
    var ss = new StringStream(aLine);
    var tr = new Tokenizer(ss);
    var p = new Parser(tr);
    p.parse();
    if (aPrintOk) {
        PUT('Ok');
    }
}
function transpile() {
    var src = document.getElementById('source').value;
    CLS();
    PUT(src);
}

var STATUS_BEGIN = 'begin';
var STATUS_END   = 'end';
