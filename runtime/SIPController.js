class SIPController {
    constructor() {
        this.ensureDummyTextArea();
    }
    ensureDummyTextArea() {
        if (this.element) {
            return;
        }
        const dummy = document.createElement('textarea');
        dummy.style.position = 'absolute';
        dummy.style.left = '-10em';
        dummy.style.top  = '-10em';
        dummy.style.fontSize = '16px';
        document.body.appendChild(dummy);
        this.element = dummy;
    }
    show() {
        this.element.focus();
    }
}