function Parser(aTokenizer) {
    this.tr = aTokenizer;
}
Parser.prototype = {
    statements: {
        CLS: function () {
            eval('CLS();');
        },
        PRINT: function () {
            var expr = this.parseExpression();
            if (expr == null) {
                throw 'Syntax error';
            }
            eval('PUT(' + expr[1] + ');');
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
    parseStatement: function () {
        var t = this.tr.getNextToken();
        switch (t[0]) {
        case TOKEN_IDENT:
            var statement = t[1].toUpperCase();
            this.statements[statement].apply(this);
        }
    },
    parseExpression: function () {
        var t = this.skipWhitespaces();
        switch (t[0]) {
        case TOKEN_IDENT:
        case TOKEN_DIGIT:
        case TOKEN_STRING:
            return t;
        }
        this.tr.back();
        return null;
    },
    skipWhitespaces: function () {
        var t = this.tr.getNextToken();
        while (t[0] == TOKEN_SPACE) {
            t = this.tr.getNextToken();
        }
        return t;
    },
};