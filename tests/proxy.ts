
import { EventEmitter } from 'events';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { ReturnInfo } from './../src/interfaces';
import { ProxyListener } from './../src/proxy';
import { MethodFilter } from './../src/filters';

class TestObject {
	public method() {}
	public methodWithValue(value: any) { return value; }
	public methodPromiseResolve() { return Promise.resolve() }
	public methodPromiseResolveWithValue(value: any) { return Promise.resolve(value); }
	public methodPromiseRejectWithValue(value: any) { return Promise.reject(value); }
}

const eventEmitter = new EventEmitter();
const methodFilter = new MethodFilter(['*:*']);

describe('ProxyListener', () => {

	describe('apply', () => {

		context('inspectReturnedPromise true', () => {

			const proxyListener = new ProxyListener(eventEmitter, methodFilter, { inspectReturnedPromise: true });
			const object = new TestObject();
			const spy = sinon.spy();

			it('should call return event with promise\'s value in result', () => {

				proxyListener.apply(object);

				eventEmitter.addListener('return', spy);

				const eventSpy = function(returnInfo: ReturnInfo) {
					expect(returnInfo.className).to.equal('TestObject');
					expect(returnInfo.methodName).to.equal('methodPromiseResolveWithValue');
					expect(returnInfo.result).to.equal(2);
					eventEmitter.removeListener('return', eventSpy);
				};

				eventEmitter.addListener('return', eventSpy);

				const returnedValue = object.methodPromiseResolveWithValue(2);

				expect(spy.notCalled).to.be.true;
				expect(returnedValue).instanceOf(Promise);
			});

			after(() => eventEmitter.removeListener('return', spy));
		});

		context('inspectReturnedPromise false', () => {

			const proxyListener = new ProxyListener(eventEmitter, methodFilter, { inspectReturnedPromise: false });
			const object = new TestObject();
			const spy = sinon.spy();

			it('should call return event with promise in result', () => {

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

			after(() => eventEmitter.removeListener('return', spy));
		});
	});
});