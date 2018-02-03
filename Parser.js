function Parser(aTokenizer) {
    this.tr = aTokenizer;
}
Parser.prototype = {
    statements: {
        CLS: function () {
            eval('CLS();');
        },
        PRINT: function () {
            var t2 = this.skipWhitespaces();
            if (t2[0] != TOKEN_STRING) {
                throw 'Syntax error';
            }
            eval('PUT(' + t2[1] + ');');
        },
        LOCATE: function () {
            var t2 = this.skipWhitespaces();
            var t3 = this.skipWhitespaces();
            var t4 = this.skipWhitespaces();
            if (t2[0] != TOKEN_DIGIT ||
                t3[0] != TOKEN_COMMA ||
                t4[0] != TOKEN_DIGIT) {
                throw 'Syntax error';
            }
            eval('LOCATE(' + t2[1] + ',' + t4[1] + ')');
        },
    },
    parse: function () {
        var t = this.tr.getNextToken();
        switch (t[0]) {
        case 'ident':
            var statement = t[1].toUpperCase();
            this.statements[statement].apply(this);
        }
    },
    skipWhitespaces: function () {
        var t = this.tr.getNextToken();
        while (t[0] == TOKEN_SPACE) {
            t = this.tr.getNextToken();
        }
        return t;
    },
};