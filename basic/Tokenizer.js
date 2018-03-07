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
        this.isEOS = false;
        this.escaped = false;
        this.pushBacked = [];
    }

    next() {
        if (this.pushBacked.length > 0) {
            return this.pushBacked.pop();
        }
        if (this.state == this.endState) {
            return null;
        }
        while (true) {
            const c = this.stream.getc();
            if (c == null) {
                this.isEOS = true;
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
        if (this.isEOS) {
            return;
        }
        this.stream.back();
        this.token = this.token.substr(0, this.token.length - 1);
    }

    reset() {
        this.token = '';
        if (this.state != this.endState) {
            this.state = this.beginState;
        }
    }
    
    // Tokenizer states

    beginState(c) {
        const rules = [
            [(c) => c == null, this.endState],
            [isDigit,          this.intOrFloatState],
            [isIdentStart,     this.identState],
            [isSpace,          this.skipSpaceState],
            [(c) => c == '"',  this.stringState],
        ];
        for (const rule of rules) {
            const predicate = rule.shift();
            const newState  = rule.shift();
            if (predicate(c)) {
                this.state = newState;
                return null;
            }
        }
        const found = OPERATOR_TOKENS[c];
        if (!found) {
            throw 'Unexpected token';
        }
        return found;
    }
    endState(c) {
        return Token.EOS;
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
        if (!c) {
            throw new Error('Unexpected End of Stream!');
        }
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
