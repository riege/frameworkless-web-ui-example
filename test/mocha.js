const mocha = window.mocha
const expect = window.chai.expect

mocha.setup('bdd');
mocha.checkLeaks();

export { expect, mocha }