window.addEventListener('load'
, function () {
    main();
}, false);

function main() {
    var button = document.getElementById('transpile');
    button.addEventListener('click', function () {
        transpile();
    }, false);
    PUT('Hello');
}
function transpile() {
    var src = document.getElementById('source').value;
    CLS();
    PUT(src);

/*    
    var ss = new StringStream('test');
    for (;;) {
        var c = ss.getc();
        if (c == null) {
            break;
        }
        PUT(c);
    }
    var c = '0'.charCodeAt(0);
    PUT(isDigit(c));
    */
//    var ss = new StringStream('123,');
//    var ss = new StringStream('I=3029.9');
//    var ss = new StringStream('I=1+3');
//    var ss = new StringStream('I=(1+3)*2');
//    var ss = new StringStream('I=(X_Y+3)*2');
    var ss = new StringStream('SCREEN 1, 2');
    var tr = new Tokenizer(ss);
    for (;;) {
        var t = tr.getNextToken();
        if (t == null) {
            break;
        }
        PUT(t);
    }
}

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

// 登場する文字種
// A-Za-z    => ALPHA
// 0-9       => DIGIT
// 小数をどう表現するか
// A-Za-z0-9 => IDENT
// +-*/      => OPERATOR
// SPACE
// .         => PERIOD
// (         => OPEN_PAREN
// )         => CLOSE_PAREN
// [         => OPEN_BLOCK
// ]         => CLOSE_BLOCK

// 登場するトークン種別
// IDENT
// KEYWORDS ... IDENT としてトークン化したあと判別するべき
// NUMBER
// OPEN_PAREN  => (
// CLOSE_PAREN => )
// SEPARATOR   => ;
// COMMA       => ,

var STATUS_BEGIN = 'begin';
var STATUS_END   = 'end';

var TOKEN_DIGIT = 'digit';
var TOKEN_IDENT = 'ident';
var TOKEN_EQUAL = 'equal';
var TOKEN_PLUS  = 'plus';
var TOKEN_MINUS = 'minus';
var TOKEN_MUL   = 'mul';
var TOKEN_SLASH = 'slash';
var TOKEN_DIV   = 'div'; // token としては IDENT として扱う？
var TOKEN_MOD   = 'mod'; // token としては IDENT として扱う？
var TOKEN_OPEN_PAREN  = 'open_paren';
var TOKEN_CLOSE_PAREN = 'close_paren';
var TOKEN_SPACE = 'space';
var TOKEN_COMMA = 'comma';

function CHR(c) {
    if (c == null) {
        return -1;
    }
    return c.charCodeAt(0);
}
function isAlpha(c) {
    var code = CHR(c);
    return (CHR('A') <= code && code <= CHR('Z'))
        || (CHR('a') <= code && code <= CHR('z'));
}
function isIdentStart(c) {
    return c == '_' || isAlpha(c);
}
function isDigit(c) {
    var num = CHR(c) - CHR('0');
    return 0 <= num && num <= 9;
}
function isSpace(c) {
    return c == ' ';
}

function Tokenizer(aStream) {
    this.stream = aStream;
    this.token = '';
    this.state = this.beginState;
    this.isEOF = false;
}
Tokenizer.prototype = {
    beginState: function (c) {
        if (isDigit(c)) {
            this.state = this.digitState;
            return null;
        }
        if (isIdentStart(c)) {
            this.state = this.identState;
            return null;
        }
        if (isSpace(c)) {
            this.state = this.spaceState;
            return null;
        }
        var operators = [
            ['=', TOKEN_EQUAL],
            ['+', TOKEN_PLUS],
            ['-', TOKEN_MINUS],
            ['*', TOKEN_MUL],
            ['/', TOKEN_SLASH],
            ['(', TOKEN_OPEN_PAREN],
            [')', TOKEN_CLOSE_PAREN],
            [',', TOKEN_COMMA],
        ];
        for (var i = 0; i < operators.length; ++i) {
            var op    = operators[i][0];
            var token = operators[i][1];
            if (op == c) {
                return token;
            }
        }
        throw 'Unexpected token';
    },
    
    back: function () {
        if (this.isEOF) {
            return;
        }
        this.stream.back();
        this.token = this.token.substr(0, this.token.length - 1);
    },
    
    digitState: function (c) {
        if (isDigit(c)) {
            return null;
        }
        this.back();
        return TOKEN_DIGIT;
    },
    
    identState: function (c) {
        if (isIdentStart(c) ||
            isDigit(c)) {
            return null;
        }
        this.back();
        return TOKEN_IDENT;
    },
    
    spaceState: function (c) {
        if (isSpace(c)) {
            return null;
        }
        this.back();
        return TOKEN_SPACE;
    },
    
    check: function (c) {
        var result = this.state(c);
        if (result != null) {
            var token = this.token;
            this.token = '';
            this.state = this.beginState;
            return [result, token];
        }
        return null;
    },
    
    // returns [type, string]
    getNextToken: function () {
        if (this.isEOF) {
            return null;
        }
        for (;;) {
            var c = this.stream.getc();
            if (c == null) {
                this.isEOF = true;
                var result = this.check(null);
                if (result != null) {
                    return result;
                }
                return  null;
            }
            this.token += c;
            var result = this.check(c);
            if (result != null) {
                return result;
            }
        }
    },
};
function CLS() {
    var console = document.getElementById('console');
    console.innerHTML = '';
}
function PUT(aText) {
    var console = document.getElementById('console');
    console.innerHTML += aText + '\n';
}
