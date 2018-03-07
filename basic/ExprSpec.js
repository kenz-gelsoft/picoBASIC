describe('Expr', function () {
    function parse(aStr) {
        const ss = new StringStream(aStr);
        const tr = new Tokenizer(ss);
        return Expr.parse(tr).toJS();
    }
    it('should parse a integer', function () {
        expect(parse('1')).toBe('1');
        expect(parse('2')).toBe('2');
        expect(parse('10')).toBe('10');
        expect(parse('256')).toBe('256');
        expect(parse('01')).toBe('01');
    });
    it('should parse a integer with another token', function () {
        expect(parse('1,')).toBe('1');
        expect(parse('2=')).toBe('2');
        expect(parse('10""')).toBe('10');
        // FIXME following doesn't stop
        // expect(parse('10"')).toBe('10');
    });
});