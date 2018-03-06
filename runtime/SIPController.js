class SIPController {
    constructor() {
        const e = document.createElement('textarea');
        e.style.position = 'absolute';
        e.style.left = '-10em';
        e.style.top  = '-10em';
        e.style.fontSize = '16px';
        document.body.appendChild(e);
        this.element = e;
    }
    show() {
        this.element.focus();
    }
}