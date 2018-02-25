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
        ['PRINT"HELLO \\\"WORLD\\\""', [
            new Token(Token.IDENT, 'PRINT'),
            new Token(Token.STRING, '"HELLO \\"WORLD\\""'),
            new Token(Token.EOS, ''),
        ]],
        ['PRINT"HELLO"', [
            new Token(Token.IDENT, 'PRINT'),
            new Token(Token.STRING, '"HELLO"'),
            new Token(Token.EOS, ''),
        ]],
        ['123,', [
            new Token(Token.INT, '123'),
            new Token(Token.COMMA, ','),
            new Token(Token.EOS, ''),
        ]],
        ['I=3029.9', [
            new Token(Token.IDENT, 'I'),
            new Token(Token.EQUAL, '='),
            new Token(Token.FLOAT, '3029.9'),
            // FIXME: here should be EOS
        ]],
        ['I=1+3', [
            new Token(Token.IDENT, 'I'),
            new Token(Token.EQUAL, '='),
            new Token(Token.INT, '1'),
            new Token(Token.PLUS, '+'),
            new Token(Token.INT, '3'),
            // FIXME: here should be EOS
        ]],
        ['I=(1+3)*2', [
            new Token(Token.IDENT, 'I'),
            new Token(Token.EQUAL, '='),
            new Token(Token.OPEN_PAREN, '('),
            new Token(Token.INT, '1'),
            new Token(Token.PLUS, '+'),
            new Token(Token.INT, '3'),
            new Token(Token.CLOSE_PAREN, ')'),
            new Token(Token.MUL, '*'),
            new Token(Token.INT, '2'),
        ]],
        ['I=(X_Y+3)*2', [
            new Token(Token.IDENT, 'I'),
            new Token(Token.EQUAL, '='),
            new Token(Token.OPEN_PAREN, '('),
            new Token(Token.IDENT, 'X_Y'),
            new Token(Token.PLUS, '+'),
            new Token(Token.INT, '3'),
            new Token(Token.CLOSE_PAREN, ')'),
            new Token(Token.MUL, '*'),
            new Token(Token.INT, '2'),
        ]],
        ['SCREEN 1, 2', [
            new Token(Token.IDENT, 'SCREEN'),
            new Token(Token.INT, '1'),
            new Token(Token.COMMA, ','),
            new Token(Token.INT, '2'),
        ]],
        ['LINE (20,40)-(50,50),3', [
            new Token(Token.IDENT, 'LINE'),
            new Token(Token.OPEN_PAREN, '('),
            new Token(Token.INT, '20'),
            new Token(Token.COMMA, ','),
            new Token(Token.INT, '40'),
            new Token(Token.CLOSE_PAREN, ')'),
            new Token(Token.MINUS, '-'),
            new Token(Token.OPEN_PAREN, '('),
            new Token(Token.INT, '50'),
            new Token(Token.COMMA, ','),
            new Token(Token.INT, '50'),
            new Token(Token.CLOSE_PAREN, ')'),
            new Token(Token.COMMA, ','),
            new Token(Token.INT, '3'),
        ]],
    ];
    for (pair of tests) {
        const line = pair.shift();
        const answer = pair.shift();
        PUT(`Testing |${line}| ...`);
        const ss = new StringStream(line);
        const tr = new Tokenizer(ss);
        const tokens = [];
        while (true) {
            const t = tr.next();
            if (t == null) {
                break;
            }
            tokens.push(t);
        }
        assert(new Equals(answer, tokens));
    }
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
