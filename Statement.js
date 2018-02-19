function Statement(aTokenizer) {
    this.tr = aTokenizer;
    this.js = '';
}
Statement.parse = function (tr) {
    var s = new Statement(tr);
    s.parse();
    return s;
};
Statement.prototype = {
    parse: function () {
        var t = this.tr.getNextToken();
        switch (t[0]) {
        case TOKEN_IDENT:
            var s = t[1].toUpperCase();
            this.js = this[s].apply(this);
            var t2 = this.tr.getNextToken();
            if (t2) {
                throw 'Syntax error';
            }
        }
    },
    toJS: function () {
        return this.js;
    },

    // BASIC statements
    CLS: function () {
        return 'CLS();';
    },
    PRINT: function () {
        var expr = Expr.parse(this.tr);
        if (!expr) {
            throw 'Syntax error';
        }
        return 'PUT(' + expr.toJS() + ');';
    },
    LOCATE: function () {
        var t2 = this.tr.getNextToken();
        var t3 = this.tr.getNextToken();
        var t4 = this.tr.getNextToken();
        if (t2[0] != TOKEN_INT ||
            t3[0] != TOKEN_COMMA ||
            t4[0] != TOKEN_INT) {
            throw 'Syntax error';
        }
        return 'LOCATE(' + t2[1] + ',' + t4[1] + ')';
    },
};