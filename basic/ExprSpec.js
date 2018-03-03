describe('Expr', function () {
    function parse(aStr) {
        const ss = new StringStream(aStr);
        const tr = new Tokenizer(ss);
        return Expr.parse(tr);
    }
    it('should parse a integer', function () {
       expect(parse('1')).not.toBe(null);
    });
});