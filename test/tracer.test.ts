
import { expect } from 'chai';
import { InversifyTracer } from './../src/tracer';
import { InvalidFilterError } from './../src/invalid-filter-error';
import { InvalidTracerEventError } from './../src/invalid-tracer-event-error';

describe('InversifyTracer', () => {

    describe('constructor', () => {

        context('invalid filter', () => {

            it('should throw InvalidFilterError', () => {
                expect(() => { new InversifyTracer({ filters: ['invalid!"#!filter'] }); }).to.throw(InvalidFilterError);
            });
        });
    });

    describe('on', () => {

        context('invalid event', () => {
            const tracer = new InversifyTracer();

            it('should throw InvalidFilterError', () => {
                expect(() => { tracer.on('invalid-event', () => { return; }); }).to.throw(InvalidTracerEventError);
            });
        });
    });
});
