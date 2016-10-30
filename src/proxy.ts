
export declare type OnCall = (className: string, methodName: string, args: any[]) => void;
export declare type OnReturn = (className: string, methodName: string, result: any) => void;

export function setup (object: any, onCall: OnCall, onReturn: OnReturn) {

	const className = object.constructor.name;

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
		object[methodName] = new Proxy(object[methodName], {
			apply: (method: any, object: any, args: any) => {
				onCall(className, methodName, args);
				let result = method.apply(object, args);
				onReturn(className, methodName, result);
			}
		});
	});

	return object;
};