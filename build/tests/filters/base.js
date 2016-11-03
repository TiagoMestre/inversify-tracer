"use strict";
const chai_1 = require('chai');
const filters_1 = require('./../../src/filters');
describe('BaseFilter', () => {
    describe('baseMatch', () => {
        context('use cache', () => {
            const classFilter = new filters_1.ClassFilter(['*:*']);
            it('should save Ninja match in cache', () => {
                classFilter.match('Ninja');
                chai_1.expect(classFilter.cache.get('Ninja')).to.be.true;
            });
            it('should return same result using cache', () => {
                classFilter.match('Samurai');
                chai_1.expect(classFilter.match('Samurai')).to.be.true;
            });
        });
    });
});
//# sourceMappingURL=base.js.map