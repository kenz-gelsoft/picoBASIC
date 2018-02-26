class TestConsole {
    constructor(aId) {
        this.id = aId;
    }
    print(aString) {
        document.getElementById(this.id).innerText += `${aString}\n`;
    }
}