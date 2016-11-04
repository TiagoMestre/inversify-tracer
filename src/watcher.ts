
import { EventEmitter } from 'events';
import { interfaces } from 'inversify';
import * as minimatch from 'minimatch';

import { WatcherOptions, CallInfo, ReturnInfo } from './interfaces';
import { normalizeFilters, ClassFilter, MethodFilter } from './filters';
import { ProxyListener } from './proxy';

const defaultOptions: WatcherOptions = {
    filters: ['*:*'],
	inspectReturnedPromise: true
};

function merge (base: any, newObj: any) {

	for (let prop in newObj) {
		base[prop] = base[prop] || newObj[prop];
	}

	return base;
}

export class InversifyWatcher {

	private emitter: EventEmitter = new EventEmitter();

	private classFilter: ClassFilter;

	private proxyListener: ProxyListener;

	constructor(options?: WatcherOptions) {

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
		this.emitter.on(eventName, callback);
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