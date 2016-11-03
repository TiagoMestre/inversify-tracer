
import { EventEmitter } from 'events';
import { OnCall, OnReturn } from './interfaces';
import { MethodFilter } from './filters';

const STRIP_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/mg;
const ARGUMENT_NAMES = /([^\s,]+)/g;

const constructorName = 'constructor';

function getParamNames(func: Function) {
	const fnStr = func.toString().replace(STRIP_COMMENTS, '');
	return fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES) || [];
}

export interface ProxyListenerOptions {
	inspectReturnedPromise: boolean;
}

export class ProxyListener {

	private idCounter: number = 0;
	private emitter: EventEmitter;
	private methodFilter: MethodFilter;

	private options: ProxyListenerOptions;

	constructor(emitter: EventEmitter, methodFilter: MethodFilter, options: ProxyListenerOptions) {
		this.emitter = emitter;
		this.methodFilter = methodFilter;
		this.options = options;
	}

	public apply(object: any) {

		const className = object.constructor.name;
		const objectId: number = this.idCounter++;

		let properties: Set<string> = new Set<string>();
		let obj = object;

		while (Object.getPrototypeOf(obj) !== null) {

			Object.getOwnPropertyNames(obj).forEach((propertyName) => {
				properties.add(propertyName);
			});

			obj = Object.getPrototypeOf(obj);
		}

		let methods: string[] = [];

		properties.forEach((propertyName: string) => {
			if (typeof(object[propertyName]) === 'function' && propertyName !== constructorName) {
				methods.push(propertyName);
			}
		});

		methods.filter((methodName: string) => {
			return this.methodFilter.match(className, methodName);
		});

		methods.forEach((methodName: string) => {

			const params = getParamNames(object[methodName]);
			object[methodName] = new Proxy(object[methodName], {
				apply: (method: any, object: any, args: any[]) => {

					this.emitter.emit('call', {
						objectId,
						className,
						methodName,
						arguments: args.length > params.length ? args : args.concat(new Array(params.length - args.length)),
						parameters: params
					});

					const result = method.apply(object, args);

					if (this.options.inspectReturnedPromise && result instanceof Promise) {

						return result.then((value: any) => {
							this.emitter.emit('return', { objectId, className, methodName, result: value });
							return Promise.resolve(value);
						}).catch((error: any) => {
							this.emitter.emit('return', { objectId, className, methodName, error });
							return Promise.reject(error);
						});

					} else {
						this.emitter.emit('return', { objectId, className, methodName, result });
						return result;
					}
				}
			});
		});
	}
}