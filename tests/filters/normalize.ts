
import { expect } from 'chai';
import { InvalidFilterException } from './../../src/errors';
import { normalizeFilters } from './../../src/filters';

describe('normalizeFilters', () => {

	context('Ninja', () => {
		it('should return normalized filter', () => {
			expect(normalizeFilters(['Ninja'])[0]).to.equal('Ninja:*');
		});
	});

	context('normalized filter', () => {
		it('should return same filter', () => {
			expect(normalizeFilters(['Ninja:*'])[0]).to.equal('Ninja:*');
		});
	});

	context('invalid filter', () => {
		it('should throw InvalidFilterException', () => {
			expect(() => { normalizeFilters(['Ninja/attack']); }).to.throws(InvalidFilterException);
		});
	});
});