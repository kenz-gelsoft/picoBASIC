class Token {
    // Token Types
    static get INT()    { return 'int'; }
    static get FLOAT()  { return 'float'; }
    static get IDENT()  { return 'ident'; }
    static get EQUAL()  { return 'equal'; }
    static get PLUS()   { return 'plus'; }
    static get MINUS()  { return 'minus'; }
    static get MUL()    { return 'mul'; }
    static get SLASH()  { return 'slash'; }
    static get DIV()    { return 'div'; }
    static get MOD()    { return 'mod'; }
    static get OPEN_PAREN()     { return 'open_paren'; }
    static get CLOSE_PAREN()    { return 'close_paren'; }
    static get SPACE()  { return 'space'; }
    static get COMMA()  { return 'comma'; }
    static get PERIOD() { return 'period'; }
    static get EOS()    { return 'eos'; }
    static get STRING() { return 'string'; }
    static get EXPR()   { return 'expr'; }

    constructor(aType, aStr) {
        this.type = aType;
        this.string = aStr;
    }

    toString() {
        return `Token(${this.type}|${this.string})`;
    }

    // Token Tests
    isTerm() {
        switch (this.type) {
        case Token.IDENT:
        case Token.INT:
        case Token.FLOAT:
        case Token.STRING:
        case Token.EXPR:
            return true;
        }
        return false;
    }
    isOperator() {
        switch (this.type) {
        case Token.PLUS:
        case Token.MINUS:
        case Token.MUL:
        case Token.SLASH:
        case Token.DIV:
        case Token.MOD:
            return true;
        }
        return false;
    }

    // Operator Priorities
    opPriority() {
        switch (this.type) {
        case Token.MUL:
        case Token.SLASH:
            return 4;
        case Token.PLUS:
        case Token.MINUS:
            return 3;
        case Token.DIV:
            return 2;
        case Token.MOD:
            return 1;
        case Token.OPEN_PAREN:
            return 0;
        default:
            throw `Invald operator: ${this}`;
        }
    }
    isStronger(aRhs) {
        return this.opPriority() > aRhs.opPriority();
    }
}
