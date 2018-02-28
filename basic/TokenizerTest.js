describe('Tokenizer', function () {
    const tokenize = function (aLine) {
        const ss = new StringStream(aLine);
        const tr = new Tokenizer(ss);
        const tokens = [];
        while (true) {
            const t = tr.next();
            if (t == null) {
                break;
            }
            tokens.push(t);
        }
        return tokens;
    };
    const testLines = function () {
        for (const test of arguments) {
            const line   = test.shift();
            const answer = test.shift();
            expect(tokenize(line)).toEqual(answer);        
        }
    };
   
    it('should support strings', function () {
        testLines(
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
        );
    });
    it('should support integers', function () {
        testLines(
        ['123,', [
            new Token(Token.INT, '123'),
            new Token(Token.COMMA, ','),
            new Token(Token.EOS, ''),
        ]],
        );
    });
    it('should support variable assignments', function () {
        testLines(
        ['I=3029.9', [
            new Token(Token.IDENT, 'I'),
            new Token(Token.EQUAL, '='),
            new Token(Token.FLOAT, '3029.9'),
            // FIXME: here should be EOS
        ]],
        );
    });
    it('should support expressions', function () {
        testLines(
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
        );
    });
    it('should support other statements', function() {
        testLines(
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
        );
    });
});
