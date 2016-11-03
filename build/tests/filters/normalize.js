"use strict";
const chai_1 = require('chai');
const errors_1 = require('./../../src/errors');
const filters_1 = require('./../../src/filters');
describe('normalizeFilters', () => {
    context('Ninja', () => {
        it('should return normalized filter', () => {
            chai_1.expect(filters_1.normalizeFilters(['Ninja'])[0]).to.equal('Ninja:*');
        });
    });
    context('normalized filter', () => {
        it('should return same filter', () => {
            chai_1.expect(filters_1.normalizeFilters(['Ninja:*'])[0]).to.equal('Ninja:*');
        });
    });
    context('invalid filter', () => {
        it('should throw InvalidFilterException', () => {
            chai_1.expect(() => { filters_1.normalizeFilters(['Ninja/attack']); }).to.throws(errors_1.InvalidFilterException);
        });
    });
});
//# sourceMappingURL=normalize.js.map