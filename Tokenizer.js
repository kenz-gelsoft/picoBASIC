var TOKEN_INT = 'int';
var TOKEN_FLOAT = 'float';
var TOKEN_IDENT = 'ident';
var TOKEN_EQUAL = 'equal';
var TOKEN_PLUS  = 'plus';
var TOKEN_MINUS = 'minus';
var TOKEN_MUL   = 'mul';
var TOKEN_SLASH = 'slash';
var TOKEN_DIV   = 'div';
var TOKEN_MOD   = 'mod';
var TOKEN_OPEN_PAREN  = 'open_paren';
var TOKEN_CLOSE_PAREN = 'close_paren';
var TOKEN_SPACE = 'space';
var TOKEN_COMMA = 'comma';
var TOKEN_PERIOD = 'period';
var TOKEN_EOS = 'eos';
var TOKEN_STRING = 'string';
var TOKEN_EXPR = 'expr';

function isAlpha(c) {
    var code = ASC(c);
    return (ASC('A') <= code && code <= ASC('Z'))
        || (ASC('a') <= code && code <= ASC('z'));
}
function isIdentStart(c) {
    return c == '_' || isAlpha(c);
}
function isDigit(c) {
    var num = ASC(c) - ASC('0');
    return 0 <= num && num <= 9;
}
function isSpace(c) {
    return c == ' ';
}

function testTokenizer() {
    var tests = [
        'PRINT"HELLO \\\"WORLD\\\""',
        'PRINT"HELLO"',
        '123,',
        'I=3029.9',
        'I=1+3',
        'I=(1+3)*2',
        'I=(X_Y+3)*2',
        'SCREEN 1, 2',
        'LINE (20,40)-(50,50),3',
    ];
    tests.forEach(function (aLine) {
        PUT(aLine);
        var ss = new StringStream(aLine);
        var tr = new Tokenizer(ss);
        for (;;) {
            var t = tr.getNextToken();
            if (t == null) {
                break;
            }
            PUT(t);
        }
        PUT('-----------');
    });
}

function Tokenizer(aStream) {
    this.stream = aStream;
    this.token = '';
    this.state = this.beginState;
    this.isEOF = false;
    this.escaped = false;
}
Tokenizer.prototype = {
    beginState: function (c) {
        if (c == null) {
          return TOKEN_EOS;
        }
        if (isDigit(c)) {
            this.state = this.intOrFloatState;
            return null;
        }
        if (isIdentStart(c)) {
            this.state = this.identState;
            return null;
        }
        if (isSpace(c)) {
            this.state = this.skipSpaceState;
            return null;
        }
        if (c == '"') {
            this.state = this.stringState;
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
    
    intOrFloatState: function (c) {
        if (c == '.') {
            this.state = this.floatState;
            return null;
        }
        if (isDigit(c)) {
            return null;
        }
        this.back();
        return TOKEN_INT;
    },
    floatState: function (c) {
        if (isDigit(c)) {
            return null;
        }
        this.back();
        return TOKEN_FLOAT;
    },
    
    identState: function (c) {
        if (isIdentStart(c) ||
            isDigit(c)) {
            return null;
        }
        this.back();
        return TOKEN_IDENT;
    },
    
    skipSpaceState: function (c) {
        if (isSpace(c)) {
            return null;
        }
        this.back();
        this.state = this.beginState;
        return null;
    },
    
    stringState: function (c) {
        if (c == '\\') {
            this.escaped = true;
            return null;
        }
        if (!this.escaped && c == '"') {
           return TOKEN_STRING;
        }
        this.escaped = false;
        return null;
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
                return this.check(null);
            }
            this.token += c;
            var result = this.check(c);
            if (result != null) {
                return result;
            }
        }
    },
};
