
import { EventEmitter } from 'events';
import { interfaces } from 'inversify';
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

	public build(): interfaces.Middleware {

		return (planAndResolve: interfaces.PlanAndResolve<any>): interfaces.PlanAndResolve<any> => {

			return (planAndResolveArgs: interfaces.PlanAndResolveArgs) => {

				const objects = planAndResolve(planAndResolveArgs);

				const objectsToProxy = objects.filter((object) => {
					return this.classFilter.match(object.constructor.name);
				});

				objectsToProxy.forEach((object) => {
					return this.proxyListener.apply(object);
				});

				return objects;
			};
		};
	}
}