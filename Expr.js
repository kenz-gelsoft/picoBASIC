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
            if (this.isOperator(t)) {
                this.debug(`token: ${t}`);
                this.debug(`calcStack: ${calcStack}`);
                const rhs = calcStack.pop();
                const lhs = calcStack.pop();
                const js = `(${lhs[1]} ${t[1]} ${rhs[1]})`;
                calcStack.push(['expr', js]);
            } else {
                calcStack.push(t);
            }
        }
        this.debug(calcStack);
        const js = calcStack.pop()[1];
        this.debug(js);
        return js;
    }
    debug(aStr) {
        document.getElementById('debug').innerHTML += `${aStr}\n`;
    }
    
    // parsing states
    
    termState(t) {
        if (t[0] == TOKEN_OPEN_PAREN) {
            this.opStack.push(t);
            return true;
        }
        if (!this.isTerm(t)) {
            throw `Syntax error: ${t}`;
        }
        this.rpn.push(t);
        this.state = this.opState;
        return true;
    }

    opState(t) {
        if (t[0] == TOKEN_CLOSE_PAREN) {
            while (this.opStack.length > 0) {
                const top = this.opStack.pop();
                if (top[0] == TOKEN_OPEN_PAREN) {
                    return true;
                }
                this.rpn.push(top);
            }
            throw 'Parenthesis mismatch';
        }
        if (!this.isOperator(t)) {
            this.tr.back();
            while (this.opStack.length > 0) {
                this.rpn.push(this.opStack.pop());
            }
            return false;
        }
        const top = this.peek();
        if (top && this.isStronger(top, t)) {
            this.rpn.push(this.opStack.pop());
        }
        this.opStack.push(t);
        this.state = this.termState;
        return true;
    }
    peek() {
        return this.opStack[this.opStack.length - 1];
    }
    
    // operator priority
    
    isStronger(aOp1, aOp2) {
        return this.opPriority(aOp1) > this.opPriority(aOp2);
    }
    opPriority(aOp) {
        switch (aOp[0]) {
        case TOKEN_MUL:
        case TOKEN_SLASH:
            return 4;
        case TOKEN_PLUS:
        case TOKEN_MINUS:
            return 3;
        case TOKEN_DIV:
            return 2;
        case TOKEN_MOD:
            return 1;
        case TOKEN_OPEN_PAREN:
            return 0;
        default:
            throw `Invald operator: ${aOp}`;
        }
    }
    
    // token tests
    
    isTerm(aToken) {
        if (aToken == null) {
            return false;
        }
        switch (aToken[0]) {
        case TOKEN_IDENT:
        case TOKEN_INT:
        case TOKEN_FLOAT:
        case TOKEN_STRING:
        case TOKEN_EXPR:
            return true;
        }
        return false;
    }
    isOperator(aToken) {
        if (aToken == null) {
            return false;
        }
        switch (aToken[0]) {
        case TOKEN_PLUS:
        case TOKEN_MINUS:
        case TOKEN_MUL:
        case TOKEN_SLASH:
        case TOKEN_DIV:
        case TOKEN_MOD:
            return true;
        }
        return false;
    }
}