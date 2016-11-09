
import { expect } from 'chai';
import { MethodFilter } from './../../src/filters';

describe('MethodFilter', () => {

	describe('match', () => {

		context('allow all', () => {

			const methodFilter = new MethodFilter(['*:*']);

			it('should return true matching Ninja attack', () => {
				expect(methodFilter.match('Ninja', 'attack')).to.be.true;
			});
		});

		context('allow only Ninja attack', () => {

			const methodFilter = new MethodFilter(['Ninja:attack']);

			it('should return true matching Ninja attack', () => {
				expect(methodFilter.match('Ninja', 'attack')).to.be.true;
			});

			it('should return false matching Samurai attack', () => {
				expect(methodFilter.match('Samurai', 'attack')).to.be.false;
			});
		});

		context('allow attack from all classes', () => {

			const methodFilter = new MethodFilter(['*:attack']);

			it('should return true matching Ninja attack', () => {
				expect(methodFilter.match('Ninja', 'attack')).to.be.true;
			});

			it('should return true matching Samurai attack', () => {
				expect(methodFilter.match('Samurai', 'attack')).to.be.true;
			});
		});

		context('allow all expect attack from Ninja', () => {

			const methodFilter = new MethodFilter(['Ninja:*', '!Ninja:attack']);

			it('should return false matching Ninja attack', () => {
				expect(methodFilter.match('Ninja', 'attack')).to.be.false;
			});

			it('should return true matching Ninja hide', () => {
				expect(methodFilter.match('Ninja', 'hide')).to.be.true;
			});
		});
	});
});