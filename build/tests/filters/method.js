"use strict";
const chai_1 = require('chai');
const filters_1 = require('./../../src/filters');
describe('MethodFilter', () => {
    describe('match', () => {
        context('allow all', () => {
            const methodFilter = new filters_1.MethodFilter(['*:*']);
            it('should return true matching Ninja attack', () => {
                chai_1.expect(methodFilter.match('Ninja', 'attack')).to.be.true;
            });
        });
        context('allow only Ninja attack', () => {
            const methodFilter = new filters_1.MethodFilter(['Ninja:attack']);
            it('should return true matching Ninja attack', () => {
                chai_1.expect(methodFilter.match('Ninja', 'attack')).to.be.true;
            });
            it('should return false matching Samurai attack', () => {
                chai_1.expect(methodFilter.match('Samurai', 'attack')).to.be.false;
            });
        });
        context('allow attack from all classes', () => {
            const methodFilter = new filters_1.MethodFilter(['*:attack']);
            it('should return true matching Ninja attack', () => {
                chai_1.expect(methodFilter.match('Ninja', 'attack')).to.be.true;
            });
            it('should return true matching Samurai attack', () => {
                chai_1.expect(methodFilter.match('Samurai', 'attack')).to.be.true;
            });
        });
        context('allow all expect attack from Ninja', () => {
            const methodFilter = new filters_1.MethodFilter(['Ninja:*', '!Ninja:attack']);
            it('should return false matching Ninja attack', () => {
                chai_1.expect(methodFilter.match('Ninja', 'attack')).to.be.false;
            });
            it('should return true matching Ninja hide', () => {
                chai_1.expect(methodFilter.match('Ninja', 'hide')).to.be.true;
            });
        });
    });
});
//# sourceMappingURL=method.js.map