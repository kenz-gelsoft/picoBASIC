window.addEventListener('load', () => {
    main();
}, false);
let console = null;
function main() {
    console = new Console('console');
    testTokenizer();
}
