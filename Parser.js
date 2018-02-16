function Parser(aTokenizer) {
    this.tr = aTokenizer;
}
Parser.prototype = {
    statements: {
        CLS: function () {
            eval('CLS();');
        },
        PRINT: function () {
            var expr = new Expr(this.tr);
            if (!expr.parse()) {
                throw 'Syntax error';
            }
            eval('PUT(' + expr.toJS() + ');');
        },
        LOCATE: function () {
            var t2 = this.tr.skipWhitespaces();
            var t3 = this.tr.skipWhitespaces();
            var t4 = this.tr.skipWhitespaces();
            if (t2[0] != TOKEN_DIGIT ||
                t3[0] != TOKEN_COMMA ||
                t4[0] != TOKEN_DIGIT) {
                throw 'Syntax error';
            }
            eval('LOCATE(' + t2[1] + ',' + t4[1] + ')');
        },
    },
    parseStatement: function () {
        var t = this.tr.skipWhitespaces();
        switch (t[0]) {
        case TOKEN_IDENT:
            var statement = t[1].toUpperCase();
            this.statements[statement].apply(this);
            var t2 = this.tr.skipWhitespaces();
            if (t2) {
                throw 'Syntax error';
            }
        }
    },
};