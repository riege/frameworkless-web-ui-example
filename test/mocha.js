/* jshint ignore:start */
const mocha = window.mocha
/* jshint ignore:end */
const expect = window.chai.expect

mocha.setup('bdd');
mocha.checkLeaks();

export { expect, mocha }
