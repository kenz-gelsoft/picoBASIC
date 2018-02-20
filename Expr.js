function Expr(aTokenizer) {
    this.tr = aTokenizer;
    this.rpn = [];
}
Expr.parse = function (tr) {
    var e = new Expr(tr);
    if (!e.parse()) {
        return null;
    }
    return e;
};
Expr.prototype = {
    parse: function () {
        this.opStack = [];
        this.state = this.termState;
        while (true) {
            var t = this.tr.next();
            this.debug(t);
            if (!this.state.apply(this, [t])) {
                break;
            }
        }
        return this.rpn.length > 0;
    },
    opState: function (t) {
        if (!this.isOperator(t)) {
            this.tr.back();
            while (this.opStack.length > 0) {
                this.rpn.push(this.opStack.pop());
            }
            return false;
        }
        var top = this.opStack[this.opStack.length - 1];
        if (top) {
            if (this.isStronger(top, t)) {
                this.rpn.push(this.opStack.pop());
            }
        }
        this.opStack.push(t);
        this.state = this.termState;
        return true;
    },
    termState: function (t) {
        if (!this.isTerm(t)) {
            throw 'Syntax error:' + t;
        }
        this.rpn.push(t);
        this.state = this.opState;
        return true;
    },
    debug: function (aStr) {
        document.getElementById('debug').innerHTML += aStr + '\n';
    },
    toJS: function () {
        var calcStack = [];
        this.debug(this.rpn);
        while (true) {
            var t = this.rpn.shift();
            if (!t) {
                break;
            }
            if (this.isOperator(t)) {
                this.debug('token: ' + t);
                this.debug('calcStack: ' + calcStack);
                var rhs = calcStack.pop();
                var lhs = calcStack.pop();
                var js = ['(', lhs[1], t[1], rhs[1], ')'].join('');
                calcStack.push(['expr', js]);
            } else {
                calcStack.push(t);
            }
        }
        this.debug(calcStack);
        var js = calcStack.pop()[1];
        this.debug(js);
        return js;
    },
    isStronger: function (aOp1, aOp2) {
        return this.opPriority(aOp1) > this.opPriority(aOp2);
    },
    opPriority: function (aOp) {
        switch (aOp[0]) {
        case TOKEN_MUL:
        case TOKEN_SLASH:
            return 3;
        case TOKEN_PLUS:
        case TOKEN_MINUS:
            return 2;
        case TOKEN_DIV:
            return 1;
        case TOKEN_MOD:
            return 0;
        default:
            throw 'Invald operator'
        }
    },
    isTerm: function (aToken) {
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
    },
    isOperator: function (aToken) {
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
    },
};