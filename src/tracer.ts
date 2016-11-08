
import { EventEmitter } from 'events';
import { interfaces, Kernel } from 'inversify';
import * as minimatch from 'minimatch';

import { TracerOptions, CallInfo, ReturnInfo } from './interfaces';
import { normalizeFilters, ClassFilter, MethodFilter } from './filters';
import { InvalidTracerEventError } from './errors';
import { ProxyListener } from './proxy';

const defaultOptions: TracerOptions = {
    filters: ['*:*'],
	inspectReturnedPromise: true
};

function merge (base: any, newObj: any) {

	for (let prop in newObj) {
		base[prop] = base[prop] || newObj[prop];
	}

	return base;
}

export class InversifyTracer {

	private emitter: EventEmitter = new EventEmitter();

	private classFilter: ClassFilter;

	private proxyListener: ProxyListener;

	constructor(options?: TracerOptions) {

		if (options) {
			options = merge(options, defaultOptions);
		} else {
			options = defaultOptions;
		}

		options.filters = normalizeFilters(options.filters);

		this.classFilter = new ClassFilter(options.filters);

		this.proxyListener = new ProxyListener(
			this.emitter,
			new MethodFilter(options.filters),
			{
				inspectReturnedPromise: options.inspectReturnedPromise
			}
		);
	}

	public on(eventName: string, callback: any) {

		if (eventName !== 'call' && eventName !== 'return') {
			throw new InvalidTracerEventError(eventName);
		}

		this.emitter.on(eventName, callback);
		return this;
	}

	public apply(kernel: any): void {

		for (let i in kernel._bindingDictionary._dictionary) {
			for (let j in kernel._bindingDictionary._dictionary[i].value) {
				kernel._bindingDictionary._dictionary[i].value[j].onActivation = (context: any, target: any) => {

					if (this.classFilter.match(target.constructor.name)) {
						this.proxyListener.apply(target);
					}

					return target;
				};
			}
		}
	}
}