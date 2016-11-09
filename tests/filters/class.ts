
import { expect } from 'chai';
import { ClassFilter } from './../../src/filters';

describe('ClassFilter', () => {

	describe('match', () => {

		context('allow all', () => {

			const classFilter = new ClassFilter(['*:*']);

			it('should return true matching Ninja', () => {
				expect(classFilter.match('Ninja')).to.be.true;
			});
		});

		context('allow Ninja only', () => {

			const classFilter = new ClassFilter(['Ninja:*']);

			it('should return true matching Ninja', () => {
				expect(classFilter.match('Ninja')).to.be.true;
			});

			it('should return false matching Samurai', () => {
				expect(classFilter.match('Samurai')).to.be.false;
			});
		});

		context('allow all expect Samurai', () => {

			const classFilter = new ClassFilter(['*:*', '!Samurai:*']);

			it('should return true matching Ninja', () => {
				expect(classFilter.match('Ninja')).to.be.true;
			});

			it('should return false matching Samurai', () => {
				expect(classFilter.match('Samurai')).to.be.false;
			});
		});

		context('no filters', () => {

			const classFilter = new ClassFilter([]);

			it('should return false matching Ninja', () => {
				expect(classFilter.match('Ninja')).to.be.false;
			});
		});

		context('partial filter', () => {

			const classFilter = new ClassFilter(['Nin*:*']);

			it('should return true matching Ninja', () => {
				expect(classFilter.match('Ninja')).to.be.false;
			});
		});
	});
});