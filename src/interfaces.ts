
interface BaseInfo {
	className: string;
	methodName: string;
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
