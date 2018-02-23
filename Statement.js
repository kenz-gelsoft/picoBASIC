class Statement {
    constructor(aTokenizer) {
        this.tr = aTokenizer;
        this.js = '';
    }
    static parse(tr) {
        var s = new Statement(tr);
        s.parse();
        return s;
    }
    parse() {
        var t = this.tr.next();
        switch (t[0]) {
        case TOKEN_IDENT:
            var s = t[1].toUpperCase();
            var st = this[s];
            if (st == null) {
                this.tr.back();
                st = this.LET;
            }
            this.js = st.apply(this);
            var t2 = this.tr.next();
            if (t2) {
                throw 'Syntax error';
            }
            break;
        default:
            throw 'Syntax error';
        }
    }
    toJS() {
        return this.js;
    }

    // BASIC statements
    LET() {
        var varName = this.tr.next();
        var eq = this.tr.next();
        var val = Expr.parse(this.tr);
        if (varName[0] != TOKEN_IDENT ||
            eq[0] != TOKEN_EQUAL ||
            val == null) {
            throw 'Syntax error';
        }
       return varName[1] + '=' + val.toJS();
    }
    
    CLS() {
        return 'CLS();';
    }
    PRINT() {
        var expr = Expr.parse(this.tr);
        if (!expr) {
            throw 'Syntax error';
        }
        return 'PUT(' + expr.toJS() + ');';
    }
    LOCATE() {
        var t2 = this.tr.next();
        var t3 = this.tr.next();
        var t4 = this.tr.next();
        if (t2[0] != TOKEN_INT ||
            t3[0] != TOKEN_COMMA ||
            t4[0] != TOKEN_INT) {
            throw 'Syntax error';
        }
        return 'LOCATE(' + t2[1] + ',' + t4[1] + ')';
    }
}
