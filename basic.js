window.addEventListener('load', function () {
    main();
}, false);

var console = null;
function main() {
    console = new Console('console');
    
    PUT('picoBASIC version 0.0');
    PUT('COPYRIGHT (C) 2018 picoBASIC PROJECT.');
    PUT('Ok');
}
function parseLine(aLine, aPrintOk) {
    var ss = new StringStream(aLine);
    var tr = new Tokenizer(ss);
    var p = new Parser(tr);
    p.parseStatement();
    if (aPrintOk) {
        PUT('Ok');
    }
}
