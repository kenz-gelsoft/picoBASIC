class SIPController {
    constructor(aId='dummy') {
        this.id = aId;
        this.element = this.ensureDummyTextArea();
    }
    ensureDummyTextArea() {
        var dummy = document.getElementById(this.id);
        if (dummy) {
            return dummy;
        }
        dummy = document.createElement('textarea');
        dummy.id = this.id;
        dummy.style.position = 'absolute';
        dummy.style.left = '-10em';
        dummy.style.top  = '-10em';
        dummy.style.fontSize = '16px';
        document.body.appendChild(dummy);
        return dummy;
    }
    show() {
        this.element.focus();
    }
}