window.addEventListener('load', () => {
    main();
}, false);

let console = null;
function main() {
    console = new Console('console');
    
    PUT('picoBASIC version 0.0');
    PUT('COPYRIGHT (C) 2018 picoBASIC PROJECT.');
    PUT('Ok');
}
function parseLine(aLine, aPrintOk=false) {
    const ss = new StringStream(aLine);
    const tr = new Tokenizer(ss);
    const s = Statement.parse(tr);
    eval(s.toJS());
    if (aPrintOk) {
        PUT('Ok');
    }
}
