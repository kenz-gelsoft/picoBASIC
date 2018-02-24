class Expr {
    constructor(aTokenizer) {
        this.tr = aTokenizer;
        this.rpn = [];
    }
    static parse(tr) {
        const e = new Expr(tr);
        if (!e.parse()) {
            return null;
        }
        return e;
    }
    parse() {
        this.opStack = [];
        this.state = this.termState;
        while (true) {
            const t = this.tr.next();
            this.debug(t);
            if (!this.state.apply(this, [t])) {
                break;
            }
        }
        return this.rpn.length > 0;
    }
    toJS() {
        const calcStack = [];
        this.debug(this.rpn);
        while (true) {
            const t = this.rpn.shift();
            if (!t) {
                break;
            }
            if (t.isOperator()) {
                this.debug(`token: ${t}`);
                this.debug(`calcStack: ${calcStack}`);
                const rhs = calcStack.pop();
                const lhs = calcStack.pop();
                const js = `(${lhs.toJS()} ${t.toJS()} ${rhs.toJS()})`;
                calcStack.push(new Token('expr', js));
            } else {
                calcStack.push(t);
            }
        }
        this.debug(calcStack);
        const js = calcStack.pop().toJS();
        this.debug(js);
        return js;
    }
    debug(aStr) {
        document.getElementById('debug').innerHTML += `${aStr}\n`;
    }
    
    // parsing states
    
    termState(t) {
        if (t.type == Token.OPEN_PAREN) {
            this.opStack.push(t);
            return true;
        }
        if (!t.isTerm()) {
            throw `Syntax error: ${t}`;
        }
        this.rpn.push(t);
        this.state = this.opState;
        return true;
    }

    opState(t) {
        if (t.type == Token.CLOSE_PAREN) {
            while (this.opStack.length > 0) {
                const top = this.opStack.pop();
                if (top.type == Token.OPEN_PAREN) {
                    return true;
                }
                this.rpn.push(top);
            }
            throw 'Parenthesis mismatch';
        }
        if (!t.isOperator()) {
            this.tr.back();
            while (this.opStack.length > 0) {
                this.rpn.push(this.opStack.pop());
            }
            return false;
        }
        const top = this.peek();
        if (top && top.isStronger(t)) {
            this.rpn.push(this.opStack.pop());
        }
        this.opStack.push(t);
        this.state = this.termState;
        return true;
    }
    peek() {
        return this.opStack[this.opStack.length - 1];
    }
}
