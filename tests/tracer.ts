
import { expect } from 'chai';
import { InversifyTracer } from './../src/tracer';
import { InvalidTracerEventError } from './../src/errors';

describe('InversifyTracer', () => {

	describe('on', () => {

		context('invalid event', () => {
			const tracer = new InversifyTracer();

			it('should throw InvalidFilterError', () => {
				expect(() => { tracer.on('InvalidTracerEventError', null); }).to.throws(InvalidTracerEventError);
			});
		});
	});
});