describe('Tokenizer', () => {
    function tokenize(aLine) {
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
    function testLines() {
        for (const test of arguments) {
            const line   = test.shift();
            const answer = test.shift();
            expect(tokenize(line)).toEqual(answer);        
        }
    };
   
    it('should support strings', () => {
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
    it('should throw if unpaired double quote', () => {
        expect(() => {
            tokenize('"');
        }).toThrowError();
    });
    it('should support integers', () => {
        testLines(
        ['123,', [
            new Token(Token.INT, '123'),
            new Token(Token.COMMA, ','),
            new Token(Token.EOS, ''),
        ]],
        );
    });
    it('should support variable assignments', () => {
        testLines(
        ['I=3029.9', [
            new Token(Token.IDENT, 'I'),
            new Token(Token.EQUAL, '='),
            new Token(Token.FLOAT, '3029.9'),
            new Token(Token.EOS, ''),
        ]],
        );
    });
    it('should support expressions', () => {
        testLines(
        ['I=1+3', [
            new Token(Token.IDENT, 'I'),
            new Token(Token.EQUAL, '='),
            new Token(Token.INT, '1'),
            new Token(Token.PLUS, '+'),
            new Token(Token.INT, '3'),
            new Token(Token.EOS, ''),
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
            new Token(Token.EOS, ''),
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
            new Token(Token.EOS, ''),
        ]],
        );
    });
    it('should support other statements', () => {
        testLines(
        ['SCREEN 1, 2', [
            new Token(Token.IDENT, 'SCREEN'),
            new Token(Token.INT, '1'),
            new Token(Token.COMMA, ','),
            new Token(Token.INT, '2'),
            new Token(Token.EOS, ''),
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
            new Token(Token.EOS, ''),
        ]],
        );
    });
    it('should throw if period occurs outside floating value', () => {
        expect(() => {
            tokenize('.')
        }).toThrowError();
   });
});
