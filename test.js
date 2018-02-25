window.addEventListener('load', () => {
    main();
}, false);

let allTests = 0;
let failed = 0;
let succeeded = 0;
function assert(condition) {
    try {
        ++allTests;
        if (condition.isMet()) {
            ++succeeded;
        } else {
            ++failed;
            PUT(`assertion failed: ${condition}`);
        }
    } catch (e) {
        ++failed;
        PUT('test failed');
    }
}
class Equals {
    constructor(a, b) {
        this.a = a;
        this.b = b;
    }
    isMet() {
        return jsonEquals(this.a, this.b);
    }
    toString() {
        return ['',
            `${this.a} is expected, but`,
            `${this.b} is specified.`
        ].join('\n\t');
    }
}
function jsonEquals(a, b) {
    const aJson = JSON.stringify(a);
    const bJson = JSON.stringify(b);
    return aJson == bJson;
}

let console = null;
function main() {
    console = new TestConsole('console');
    testTokenizer();
    var result = [`Test Results:`,
        `allTests: ${allTests}`,
        `succeeded: ${succeeded}`,
        `failed: ${failed}`,
    ].join('\n\t');
    console.print(result);
}
