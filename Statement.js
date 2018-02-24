class Statement {
    constructor(aTokenizer) {
        this.tr = aTokenizer;
        this.js = '';
    }
    static parse(tr) {
        const s = new Statement(tr);
        s.parse();
        return s;
    }
    parse() {
        const t = this.tr.next();
        switch (t[0]) {
        case TOKEN_IDENT:
            const s = t[1].toUpperCase();
            let st = this[s];
            if (st == null) {
                this.tr.back();
                st = this.LET;
            }
            this.js = st.apply(this);
            const t2 = this.tr.next();
            //this.debug(t2);
            if (t2 && t2[0] != TOKEN_EOS) {
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

    debug(str) {
        document.getElementById('debug').innerHTML += `${str}\n`;
    }

    // BASIC statements
    LET() {
        const varName = this.tr.next();
        const eq = this.tr.next();
        const val = Expr.parse(this.tr);
        if (varName[0] != TOKEN_IDENT ||
            eq[0] != TOKEN_EQUAL ||
            val == null) {
            throw 'Syntax error';
        }
       return `${varName[1]} = ${val.toJS()};`;
    }
    
    CLS() {
        return 'CLS();';
    }
    PRINT() {
        const expr = Expr.parse(this.tr);
        if (!expr) {
            throw 'Syntax error';
        }
        return `PUT(${expr.toJS()});`;
    }
    LOCATE() {
        const t2 = this.tr.next();
        const t3 = this.tr.next();
        const t4 = this.tr.next();
        if (t2[0] != TOKEN_INT ||
            t3[0] != TOKEN_COMMA ||
            t4[0] != TOKEN_INT) {
            throw 'Syntax error';
        }
        return `LOCATE(${t2[1]}, ${t4[1]});`;
    }
}
