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

class Tokenizer {
    constructor(aStream) {
        this.stream = aStream;
        this.reset();
        this.isEOF = false;
        this.escaped = false;
        this.pushBacked = [];
    }

    next() {
        if (this.pushBacked.length > 0) {
            return this.pushBacked.pop();
        }
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

    back(aToken) {
        this.pushBacked.push(aToken);
    }

    backOneChar() {
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
        this.backOneChar();
        return Token.INT;
    }
    floatState(c) {
        if (isDigit(c)) {
            return null;
        }
        this.backOneChar();
        return Token.FLOAT;
    }
    
    identState(c) {
        if (isIdentStart(c) ||
            isDigit(c)) {
            return null;
        }
        this.backOneChar();
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
        this.backOneChar();
        this.reset();
        return null;
    }
}
