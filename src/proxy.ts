
import { OnCall, OnReturn } from './interfaces';

const STRIP_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/mg;
const ARGUMENT_NAMES = /([^\s,]+)/g;

function getParamNames(func: Function) {
	const fnStr = func.toString().replace(STRIP_COMMENTS, '');
	return fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES) || [];
}

let idCounter = 0;

export function setup (object: any, onCall: OnCall, onReturn: OnReturn) {

	const className = object.constructor.name;
	const objectId: number = idCounter++;

	let properties: Set<string> = new Set<string>();
	let obj = object;

	while (Object.getPrototypeOf(obj) !== null) {

		Object.getOwnPropertyNames(obj).forEach((propertyName) => {
            properties.add(propertyName);
        });

		obj = Object.getPrototypeOf(obj);
	}

	const methods: string[] = [];

	properties.forEach((propertyName: string) => {
		if (typeof(object[propertyName]) === 'function') methods.push(propertyName);
	});

	methods.forEach((methodName: string) => {

		const params = getParamNames(object[methodName]);

		object[methodName] = new Proxy(object[methodName], {
			apply: (method: any, object: any, args: any[]) => {

				onCall({
					objectId,
					className,
					methodName,
					arguments: args.length > params.length ? args : args.concat(new Array(params.length - args.length)),
					parameters: params
				});

				const result = method.apply(object, args);

				onReturn({ objectId, className, methodName, result });
			}
		});
	});

	return object;
}