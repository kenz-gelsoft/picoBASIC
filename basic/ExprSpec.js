describe('Expr', () => {
    function parse(aStr) {
        const ss = new StringStream(aStr);
        const tr = new Tokenizer(ss);
        return Expr.parse(tr).toJS();
    }
    it('should support integers', () => {
        expect(parse('1')).toBe('1');
        expect(parse('2')).toBe('2');
        expect(parse('10')).toBe('10');
        expect(parse('256')).toBe('256');
        expect(parse('01')).toBe('01');
    });
    it('should support integers with another token', () => {
        expect(parse('1,')).toBe('1');
        expect(parse('2=')).toBe('2');
        expect(parse('10""')).toBe('10');
        expect(() => {
            parse('10"');
        }).toThrowError();
    });
    it('should support floating numbers', () => {
        expect(parse('1.2')).toBe('1.2');
        expect(parse('0.1')).toBe('0.1');
        expect(parse('00.10')).toBe('00.10');
        expect(() => {
            parse('0.0.0');
        }).toThrowError();
    });
    it('should support sum expression', () => {
        expect(parse('1+2')).toBe('(1 + 2)');
    });
    it('should support sub expression', () => {
        expect(parse('1-0.5')).toBe('(1 - 0.5)');
    });
    it('should support multiply expression', () => {
        expect(parse('2*3')).toBe('(2 * 3)');
    });
    it('should support divide expression', () => {
        expect(parse('5/2')).toBe('(5 / 2)');
    });
    it('should support parenthesized expression', () => {
        expect(parse('(1+2)')).toBe('(1 + 2)');
        expect(parse('(1+2)*3')).toBe('((1 + 2) * 3)');
        expect(parse('3-(1/2)')).toBe('(3 - (1 / 2))');
    });
    it('should handle operator priority correctly', () => {
        expect(parse('1+2*3')).toBe('(1 + (2 * 3))');
        expect(parse('4/5-6')).toBe('((4 / 5) - 6)');
  });
});
