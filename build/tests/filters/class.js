"use strict";
const chai_1 = require('chai');
const filters_1 = require('./../../src/filters');
describe('ClassFilter', () => {
    describe('match', () => {
        context('allow all', () => {
            const classFilter = new filters_1.ClassFilter(['*:*']);
            it('should return true matching Ninja', () => {
                chai_1.expect(classFilter.match('Ninja')).to.be.true;
            });
        });
        context('allow Ninja only', () => {
            const classFilter = new filters_1.ClassFilter(['Ninja:*']);
            it('should return true matching Ninja', () => {
                chai_1.expect(classFilter.match('Ninja')).to.be.true;
            });
            it('should return false matching Samurai', () => {
                chai_1.expect(classFilter.match('Samurai')).to.be.false;
            });
        });
        context('allow all expect Samurai', () => {
            const classFilter = new filters_1.ClassFilter(['*:*', '!Samurai:*']);
            it('should return true matching Ninja', () => {
                chai_1.expect(classFilter.match('Ninja')).to.be.true;
            });
            it('should return false matching Samurai', () => {
                chai_1.expect(classFilter.match('Samurai')).to.be.false;
            });
        });
        context('no filters', () => {
            const classFilter = new filters_1.ClassFilter([]);
            it('should return true matching Ninja', () => {
                chai_1.expect(classFilter.match('Ninja')).to.be.false;
            });
        });
    });
});
//# sourceMappingURL=class.js.map