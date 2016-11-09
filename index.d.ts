// Type definitions for inversify-tracer 1.0.0
// Project: https://github.com/tiagomestre/inversify-tracer
// Definitions by: TiagoMestre <https://github.com/tiagomestre>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference types="inversify" />

interface BaseInfo {
	className: string;
	methodName: string;
}

declare module 'inversify-tracer' {

	import { interfaces, Kernel } from 'inversify';

	export class InversifyTracer {
		constructor(options?: TracerOptions);
		on(eventName: string, callback: Function): void;
		apply(kernel: Kernel): void;
	} 

	export interface CallInfo extends BaseInfo {
		arguments: any[];
		parameters: string[];
	}

	export interface ReturnInfo extends BaseInfo {
		result: any;
	}

	export interface TracerOptions {
		filters?: string[];
		inspectReturnedPromise?: boolean;
	}
}
