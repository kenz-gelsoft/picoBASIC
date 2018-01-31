function Parser(aTokenizer) {
    this.tr = aTokenizer;
}
Parser.prototype = {
    statements: {
        CLS: function () {
            eval('CLS();');
        },
        PRINT: function () {
            var t2 = this.tr.getNextToken();
            while (t2[0] == TOKEN_SPACE) {
                t2 = this.tr.getNextToken();
            }
            if (t2[0] != TOKEN_STRING) {
                throw 'Syntax error';
            }
            eval('PUT(' + t2[1] + ');');
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
};