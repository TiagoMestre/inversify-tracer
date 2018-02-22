
import { expect } from 'chai';
import { ClassFilter } from './../src/class-filter';

describe('BaseFilter', () => {

    describe('baseMatch', () => {

        context('use cache', () => {

            const classFilter = new ClassFilter(['*:*']);

            it('should save Ninja match in cache', () => {
                classFilter.match('Ninja');
                expect((classFilter as any).cache.get('Ninja')).to.be.true;
            });

            it('should return same result using cache', () => {
                classFilter.match('Samurai');
                expect(classFilter.match('Samurai')).to.be.true;
            });
        });
    });
});
