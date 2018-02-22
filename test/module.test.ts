
import { expect } from 'chai';

describe('Module', () => {

    context('import main module', () => {

        it('should not throw Error', () => {
            expect(() => {
                // tslint:disable-next-line:no-require-imports
                require('./../src/index');
            }).to.not.throws(Error);
        });
    });
});
