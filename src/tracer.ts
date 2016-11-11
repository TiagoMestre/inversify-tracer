
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

		kernel._bindingDictionary._dictionary.forEach((keyValuePair: interfaces.KeyValuePair<interfaces.Binding<any>>) => {

			keyValuePair.value.forEach((binding) => {

				if (binding.cache) {
					return this.proxyListener.apply(binding.cache);
				}

				binding.onActivation = (context: any, target: any) => {

					if (this.classFilter.match(target.constructor.name)) {
						this.proxyListener.apply(target);
					}

					return target;
				};
			});
		});
	}
}