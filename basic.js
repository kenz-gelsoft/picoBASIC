window.addEventListener('load', function () {
    main();
}, false);

var console = null;
function main() {
    var button = document.getElementById('run');
    button.addEventListener('click', function () {
//        testTokenizer();
        var lines = document.getElementById('source').value.split('\n');
        lines.forEach(function (aLine) {
            var ss = new StringStream(aLine);
            var tr = new Tokenizer(ss);
            var p = new Parser(tr);
            p.parse();
        });
    }, false);
    
    console = new Console('console');
    
    PUT('This is console.');
}
function transpile() {
    var src = document.getElementById('source').value;
    CLS();
    PUT(src);
}

var STATUS_BEGIN = 'begin';
var STATUS_END   = 'end';
