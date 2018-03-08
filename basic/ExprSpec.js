describe('Expr', () => {
    function parse(aStr) {
        const ss = new StringStream(aStr);
        const tr = new Tokenizer(ss);
        return Expr.parse(tr).toJS();
    }
    it('should parse integers', () => {
        expect(parse('1')).toBe('1');
        expect(parse('2')).toBe('2');
        expect(parse('10')).toBe('10');
        expect(parse('256')).toBe('256');
        expect(parse('01')).toBe('01');
    });
    it('should parse integers with another token', () => {
        expect(parse('1,')).toBe('1');
        expect(parse('2=')).toBe('2');
        expect(parse('10""')).toBe('10');
        expect(() => {
            parse('10"');
        }).toThrowError();
    });
    it('should parse floating numbers', () => {
        expect(parse('1.2')).toBe('1.2');
        expect(parse('0.1')).toBe('0.1');
        expect(parse('00.10')).toBe('00.10');
        expect(() => {
            parse('0.0.0');
        }).toThrowError();
    });
 });