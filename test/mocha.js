const mocha = window.mocha
const describe = window.describe

mocha.setup('bdd');
mocha.checkLeaks();

export { describe, mocha }