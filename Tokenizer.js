class Token {
    // Token Types
    static get INT()    { return 'int'; }
    static get FLOAT()  { return 'float'; }
    static get IDENT()  { return 'ident'; }
    static get EQUAL()  { return 'equal'; }
    static get PLUS()   { return 'plus'; }
    static get MINUS()  { return 'minus'; }
    static get MUL()    { return 'mul'; }
    static get SLASH()  { return 'slash'; }
    static get DIV()    { return 'div'; }
    static get MOD()    { return 'mod'; }
    static get OPEN_PAREN()     { return 'open_paren'; }
    static get CLOSE_PAREN()    { return 'close_paren'; }
    static get SPACE()  { return 'space'; }
    static get COMMA()  { return 'comma'; }
    static get PERIOD() { return 'period'; }
    static get EOS()    { return 'eos'; }
    static get STRING() { return 'string'; }
    static get EXPR()   { return 'expr'; }

    constructor(aType, aStr) {
        this.type = aType;
        this.string = aStr;
    }

    toString() {
        return `Token(${this.type}|${this.string})`;
    }

    // Token Tests
    isTerm() {
        switch (this.type) {
        case Token.IDENT:
        case Token.INT:
        case Token.FLOAT:
        case Token.STRING:
        case Token.EXPR:
            return true;
        }
        return false;
    }
    isOperator() {
        switch (this.type) {
        case Token.PLUS:
        case Token.MINUS:
        case Token.MUL:
        case Token.SLASH:
        case Token.DIV:
        case Token.MOD:
            return true;
        }
        return false;
    }

    // Operator Priorities
    opPriority() {
        switch (this.type) {
        case Token.MUL:
        case Token.SLASH:
            return 4;
        case Token.PLUS:
        case Token.MINUS:
            return 3;
        case Token.DIV:
            return 2;
        case Token.MOD:
            return 1;
        case Token.OPEN_PAREN:
            return 0;
        default:
            throw `Invald operator: ${this}`;
        }
    }
    isStronger(aRhs) {
        return this.opPriority() > aRhs.opPriority();
    }
}

const OPERATOR_TOKENS = {
    '=': Token.EQUAL,
    '+': Token.PLUS,
    '-': Token.MINUS,
    '*': Token.MUL,
    '/': Token.SLASH,
    '(': Token.OPEN_PAREN,
    ')': Token.CLOSE_PAREN,
    ',': Token.COMMA,
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
                return new Token(type, value);
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
          return Token.EOS;
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
        return Token.INT;
    }
    floatState(c) {
        if (isDigit(c)) {
            return null;
        }
        this.back();
        return Token.FLOAT;
    }
    
    identState(c) {
        if (isIdentStart(c) ||
            isDigit(c)) {
            return null;
        }
        this.back();
        return Token.IDENT;
    }
    
    stringState(c) {
        if (c == '\\') {
            this.escaped = true;
            return null;
        }
        if (!this.escaped && c == '"') {
           return Token.STRING;
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
