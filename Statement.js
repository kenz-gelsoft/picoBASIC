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
        switch (t.type) {
        case Token.IDENT:
            let st = this[t.toJS()];
            if (st == null) {
                this.tr.back();
                st = this.LET;
            }
            this.js = st.apply(this);
            const t2 = this.tr.next();
            //this.debug(t2);
            if (t2 && t2.type != Token.EOS) {
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
        if (varName.type != Token.IDENT ||
            eq.type != Token.EQUAL ||
            val == null) {
            throw 'Syntax error';
        }
        return `${varName.toJS()} = ${val.toJS()};`;
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
        if (t2.type != Token.INT ||
            t3.type != Token.COMMA ||
            t4.type != Token.INT) {
            throw 'Syntax error';
        }
        return `LOCATE(${t2.toJS()}, ${t4.toJS()});`;
    }
}
