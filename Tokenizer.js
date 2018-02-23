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

var OPERATOR_TOKENS = {
    '=': TOKEN_EQUAL,
    '+': TOKEN_PLUS,
    '-': TOKEN_MINUS,
    '*': TOKEN_MUL,
    '/': TOKEN_SLASH,
    '(': TOKEN_OPEN_PAREN,
    ')': TOKEN_CLOSE_PAREN,
    ',': TOKEN_COMMA,
};

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
        while (true) {
            var t = tr.next();
            if (t == null) {
                break;
            }
            PUT(t);
        }
        PUT('-----------');
    });
}

class Tokenizer {
    constructor(aStream) {
        this.stream = aStream;
        this.reset();
        this.isEOF = false;
        this.escaped = false;
    }

    // returns [type, string]
    next() {
        if (this.isEOF) {
            return null;
        }
        while (true) {
            var c = this.stream.getc();
            if (c == null) {
                this.isEOF = true;
            } else {
                this.token += c;
            }
            var type = this.state(c);
            if (type != null) {
                var value = this.token;
                this.reset();
                return [type, value];
            }
        }
    }

    back() {
        if (this.isEOF) {
            return;
        }
        this.stream.back();
        this.token = this.token.substr(0, this.token.length - 1);
    }

    reset() {
        this.token = '';
        this.state = this.beginState;
    }
    
    // Tokenizer states

    beginState(c) {
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
        var found = OPERATOR_TOKENS[c];
        if (!found) {
            throw 'Unexpected token';
        }
        return found;
    }
    
    intOrFloatState(c) {
        if (c == '.') {
            this.state = this.floatState;
            return null;
        }
        if (isDigit(c)) {
            return null;
        }
        this.back();
        return TOKEN_INT;
    }
    floatState(c) {
        if (isDigit(c)) {
            return null;
        }
        this.back();
        return TOKEN_FLOAT;
    }
    
    identState(c) {
        if (isIdentStart(c) ||
            isDigit(c)) {
            return null;
        }
        this.back();
        return TOKEN_IDENT;
    }
    
    stringState(c) {
        if (c == '\\') {
            this.escaped = true;
            return null;
        }
        if (!this.escaped && c == '"') {
           return TOKEN_STRING;
        }
        this.escaped = false;
        return null;
    }
    
    skipSpaceState(c) {
        if (isSpace(c)) {
            return null;
        }
        this.back();
        this.reset();
        return null;
    }
}
