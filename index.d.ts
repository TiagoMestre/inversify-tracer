// Type definitions for inversify-tracer 1.0.7
// Project: https://github.com/tiagomestre/inversify-tracer
// Definitions by: TiagoMestre <https://github.com/tiagomestre>

interface BaseInfo {

	/**
	 * Class name
	 * 
	 * @type {string}
	 * @memberof BaseInfo
	 */
	className: string;

	/**
	 * Method name
	 * 
	 * @type {string}
	 * @memberof BaseInfo
	 */
	methodName: string;
}

declare module 'inversify-tracer' {

	/**
	 * Trace objects create by inversify
	 * 
	 * @export
	 * @class InversifyTracer
	 */
	export class InversifyTracer {

		/**
		 * Creates an instance of InversifyTracer.
		 * 
		 * @param {TracerOptions} [options]
		 * 
		 * @memberof InversifyTracer
		 */
		constructor(options?: TracerOptions);

		/**
		 * Listen to InversifyTracer events. Allowed events: 'call' and 'return'
		 * 
		 * @param {string} eventName
		 * @param {Function} callback
		 * 
		 * @memberof InversifyTracer
		 */
		on(eventName: string, callback: Function): void;

		/**
		 * Apply tracer to kernel or container object
		 * 
		 * @param {*} kernelOrContainer
		 * 
		 * @memberof InversifyTracer
		 */
		apply(kernelOrContainer: any): void;
	} 

	export interface CallInfo extends BaseInfo {

		/**
		 * Value of the arguments passed to the method
		 * 
		 * @type {any[]}
		 * @memberof CallInfo
		 */
		arguments: any[];

		/**
		 * Name of the method's parameters
		 * 
		 * @type {any[]}
		 * @memberof CallInfo
		 */
		parameters: string[];
	}

	export interface ReturnInfo extends BaseInfo {

		/**
		 * Method return value
		 * 
		 * @type {*}
		 * @memberof ReturnInfo
		 */
		result: any;
	}

	/**
	 * InversifyTracer options
	 * 
	 * @export
	 * @interface TracerOptions
	 */
	export interface TracerOptions {

		/**
		 * Filters that allow you to choose with classes or method to trace.
		 * Default \*:\* (all classes and methods)
		 * 
		 * @type {string[]}
		 * @memberof TracerOptions
		 */
		filters?: string[];

		/**
		 * Inspect the value of the Promise. Default true.
		 * 
		 * @type {boolean}
		 * @memberof TracerOptions
		 */
		inspectReturnedPromise?: boolean;
	}
}
