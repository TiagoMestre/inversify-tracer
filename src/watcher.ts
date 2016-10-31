
import { EventEmitter } from 'events';
import { interfaces } from 'inversify';

import { setup } from './proxy';

import { WatcherOptions, CallInfo, ReturnInfo } from './interfaces';

export class Watcher extends EventEmitter {

	private options: WatcherOptions;

	constructor(options?: WatcherOptions) {
		super();
		options = options || {};

		this.options = {
			classes: options.classes
		};
	}

	public build(): interfaces.Middleware {

		return (planAndResolve: interfaces.PlanAndResolve<any>): interfaces.PlanAndResolve<any> => {

			return (planAndResolveArgs: interfaces.PlanAndResolveArgs) => {

				return planAndResolve(planAndResolveArgs).map((object) => {

					if (
						this.options.classes &&
						this.options.classes.indexOf(object.constructor.name) === -1
					) {
						return object;
					}

					return setup(
						object,
						(callInfo: CallInfo) => { this.emit('call', callInfo); },
						(returnInfo: ReturnInfo) => { this.emit('return', returnInfo); }
					);
				});
			};
		};
	}
}