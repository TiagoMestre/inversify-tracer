
import { EventEmitter } from 'events';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { ProxyListener, ReturnInfo } from './../src/proxy-listener';
import { MethodFilter } from './../src/method-filter';

class TestObject {
    public method() { return; }
    public methodWithValue(value: any) { return value; }
    public methodPromiseResolve() { return Promise.resolve(); }
    public methodPromiseResolveWithValue(value: any) { return Promise.resolve(value); }
    public methodPromiseRejectWithValue(value: any) { return Promise.reject(value); }
}

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
    });
});
