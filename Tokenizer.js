const TOKEN_INT = 'int';
const TOKEN_FLOAT = 'float';
const TOKEN_IDENT = 'ident';
const TOKEN_EQUAL = 'equal';
const TOKEN_PLUS  = 'plus';
const TOKEN_MINUS = 'minus';
const TOKEN_MUL   = 'mul';
const TOKEN_SLASH = 'slash';
const TOKEN_DIV   = 'div';
const TOKEN_MOD   = 'mod';
const TOKEN_OPEN_PAREN  = 'open_paren';
const TOKEN_CLOSE_PAREN = 'close_paren';
const TOKEN_SPACE = 'space';
const TOKEN_COMMA = 'comma';
const TOKEN_PERIOD = 'period';
const TOKEN_EOS = 'eos';
const TOKEN_STRING = 'string';
const TOKEN_EXPR = 'expr';

const OPERATOR_TOKENS = {
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
    const code = ASC(c);
    return (ASC('A') <= code && code <= ASC('Z'))
        || (ASC('a') <= code && code <= ASC('z'));
}
function isIdentStart(c) {
    return c == '_' || isAlpha(c);
}
function isDigit(c) {
    const num = ASC(c) - ASC('0');
    return 0 <= num && num <= 9;
}
function isSpace(c) {
    return c == ' ';
}

function testTokenizer() {
    const tests = [
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
    for (line of tests) {
        PUT(line);
        const ss = new StringStream(line);
        const tr = new Tokenizer(ss);
        while (true) {
            const t = tr.next();
            if (t == null) {
                break;
            }
            PUT(t);
        }
        PUT('-----------');
    }
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
            const c = this.stream.getc();
            if (c == null) {
                this.isEOF = true;
            } else {
                this.token += c;
            }
            const type = this.state(c);
            if (type != null) {
                const value = this.token;
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
        const found = OPERATOR_TOKENS[c];
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
