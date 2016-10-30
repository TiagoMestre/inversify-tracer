
import { EventEmitter } from 'events';
import { interfaces } from 'inversify';

import { setup } from './proxy';

export class Watcher extends EventEmitter {

	public build(): interfaces.Middleware {

		return (planAndResolve: interfaces.PlanAndResolve<any>): interfaces.PlanAndResolve<any> => {
			return (planAndResolveArgs: interfaces.PlanAndResolveArgs) => {
				return planAndResolve(planAndResolveArgs).map((object) => {
					return setup(
						object,
						(className: string, methodName: string, args: any[]) => {
							this.emit('call', className, methodName, args);
						},
						(className: string, methodName: string, result: any) => {
							this.emit('return', className, methodName, result);
						},
					);
				});
			};
		};
	}
}