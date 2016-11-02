
import { EventEmitter } from 'events';
import { interfaces } from 'inversify';
import * as minimatch from 'minimatch';

import { WatcherOptions, CallInfo, ReturnInfo } from './interfaces';
import { normalizeFilters, ClassFilter, MethodFilter } from './filters';
import { ProxyListener } from './proxy';

const defaultOptions = {
    filters: ['*:*']
};

export class InversifyWatcher {

	private emitter: EventEmitter = new EventEmitter();

	private classFilter: ClassFilter;

	private proxyListener: ProxyListener;

	constructor(options: any) {

		options.filters = normalizeFilters(options.filters);

		this.classFilter = new ClassFilter(options.filters);
		this.proxyListener = new ProxyListener(
			this.emitter,
			new MethodFilter(options.filters)
		);
	}

	public on(event: string, callback: any) {
		this.emitter.on(event, callback);
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