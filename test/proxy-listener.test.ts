
import { EventEmitter } from 'events';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { ProxyListener, CallInfo, ReturnInfo, Parameter } from './../src/proxy-listener';
import { MethodFilter } from './../src/method-filter';

import { TestObject } from './test-object';

const methodFilter = new MethodFilter(['*:*']);

describe('ProxyListener', () => {

    describe('apply', () => {

        context('inspectReturnedPromise true', () => {

            it('should call return event with promise\'s value in result', async () => {

                const eventEmitter = new EventEmitter();
                const proxyListener = new ProxyListener(eventEmitter, methodFilter, { inspectReturnedPromise: true });
                const object = new TestObject();
                const spy = sinon.spy();

                proxyListener.apply(object);

                eventEmitter.addListener('return', spy);
                eventEmitter.addListener('return', (returnInfo: ReturnInfo) => {
                    expect(returnInfo.className).to.equal('TestObject');
                    expect(returnInfo.methodName).to.equal('methodPromiseResolveWithValue');
                    expect(returnInfo.result).to.equal(2);
                });

                const result = await object.methodPromiseResolveWithValue(2);
                expect(result).to.equal(2);
                expect(spy.called).to.be.true;
            });
        });

        context('inspectReturnedPromise true with error', () => {

            it('should call return event with promise\'s value in result', async () => {

                const eventEmitter = new EventEmitter();
                const proxyListener = new ProxyListener(eventEmitter, methodFilter, { inspectReturnedPromise: true });
                const object = new TestObject();
                const spy = sinon.spy();

                const methodError = new Error();

                proxyListener.apply(object);

                eventEmitter.addListener('return', spy);
                eventEmitter.addListener('return', (returnInfo: ReturnInfo) => {
                    expect(returnInfo.className).to.equal('TestObject');
                    expect(returnInfo.methodName).to.equal('methodPromiseRejectWithValue');
                    expect(returnInfo.result).to.equal(methodError);
                });

                try {
                    await object.methodPromiseRejectWithValue(methodError);
                } catch (err) {
                    expect(err).to.equal(methodError);
                    expect(spy.called).to.be.true;
                    return;
                }

                expect.fail();
            });
        });

        context('inspectReturnedPromise false', () => {

            it('should call return event with promise in result', () => {

                const eventEmitter = new EventEmitter();
                const proxyListener = new ProxyListener(eventEmitter, methodFilter, { inspectReturnedPromise: false });
                const object = new TestObject();
                const spy = sinon.spy();

                proxyListener.apply(object);

                eventEmitter.addListener('return', spy);

                const returnedValue = object.methodPromiseResolve();

                expect(spy.called).to.be.true;
                expect(spy.calledOnce).to.be.true;
                expect(returnedValue).instanceOf(Promise);
                expect(spy.calledWithMatch({
                    className: 'TestObject',
                    methodName: 'methodPromiseResolve',
                    result: returnedValue
                })).to.be.true;
            });
        });

        context('pass number, string, boolean or array', () => {

            const eventEmitter = new EventEmitter();
            const proxyListener = new ProxyListener(eventEmitter, methodFilter, { inspectReturnedPromise: false });

            it('should ignore values', () => {

                expect(() => { proxyListener.apply(32); }).to.not.throw(Error);
                expect(() => { proxyListener.apply(true); }).to.not.throw(Error);
                expect(() => { proxyListener.apply('amazing string'); }).to.not.throw(Error);
                expect(() => { proxyListener.apply([1, true, 'amazing string']); }).to.not.throw(Error);
            });
        });

        context('function as a parameter', () => {

            it('should call return event with promise in result', () => {

                const eventEmitter = new EventEmitter();
                const proxyListener = new ProxyListener(eventEmitter, methodFilter, { inspectReturnedPromise: false });
                const object = new TestObject();
                const callSpy = sinon.spy();
                const returnSpy = sinon.spy();

                proxyListener.apply(object);

                const functionParameter = () => { return; };

                eventEmitter.addListener('call', callSpy);
                eventEmitter.addListener('return', returnSpy);

                eventEmitter.addListener('call', (callInfo: CallInfo) => {
                    expect(callInfo.className).to.equal('TestObject');
                    expect(callInfo.methodName).to.equal('methodWithValue');
                    expect(callInfo.parameters).to.have.length(1);
                    expect(callInfo.parameters[0].value).to.equal(functionParameter);
                });

                eventEmitter.addListener('return', (returnInfo: ReturnInfo) => {
                    expect(returnInfo.className).to.equal('TestObject');
                    expect(returnInfo.methodName).to.equal('methodWithValue');
                    expect(returnInfo.result).to.equal(functionParameter);
                });

                const returnedValue = object.methodWithValue(functionParameter);

                expect(returnedValue).to.equal(functionParameter);

                expect(callSpy.called).to.be.true;
                expect(returnSpy.called).to.be.true;

                expect(callSpy.calledOnce).to.be.true;
                expect(returnSpy.calledOnce).to.be.true;
            });
        });

        context('more parameters than expected', () => {

            it('should emit \"call\" event', () => {

                const eventEmitter = new EventEmitter();
                const proxyListener = new ProxyListener(eventEmitter, methodFilter, { inspectReturnedPromise: false });
                const object = new TestObject();
                const spy = sinon.spy();

                proxyListener.apply(object);

                eventEmitter.addListener('call', spy);
                eventEmitter.addListener('call', (callInfo: CallInfo) => {
                    expect(callInfo.className).to.equal('TestObject');
                    expect(callInfo.methodName).to.equal('methodWithValue');
                    expect(callInfo.parameters).to.have.length(2);
                    expect(callInfo.parameters[0]).to.contain({ name: 'value', value: 2 } as Parameter);
                    expect(callInfo.parameters[1]).to.contain({ name: undefined, value: 1 } as Parameter);
                });

                const result = (object.methodWithValue as any)(2, 1);
                expect(result).to.equal(2);
                expect(spy.called).to.be.true;
            });
        });

        context('less parameters than expected', () => {

            it('should call "call" event', () => {

                const eventEmitter = new EventEmitter();
                const proxyListener = new ProxyListener(eventEmitter, methodFilter, { inspectReturnedPromise: false });
                const object = new TestObject();
                const spy = sinon.spy();

                proxyListener.apply(object);

                eventEmitter.addListener('call', spy);
                eventEmitter.addListener('call', (callInfo: CallInfo) => {
                    expect(callInfo.className).to.equal('TestObject');
                    expect(callInfo.methodName).to.equal('methodWithValue');
                    expect(callInfo.parameters).to.have.length(1);
                    expect(callInfo.parameters[0]).to.contain({ name: 'value', value: undefined } as Parameter);
                });

                const result = (object.methodWithValue as any)();
                expect(result).to.be.undefined;
                expect(spy.called).to.be.true;
            });
        });
    });
});
