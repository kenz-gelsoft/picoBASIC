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
        document.body.appendChild(dummy);
        return dummy;
    }
    show() {
        this.element.focus();
    }
}