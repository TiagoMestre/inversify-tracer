
export class InvalidFilterError extends Error {

	constructor(filter: string) {
		super(`Invalid filter (${filter})`);
	}
}

export class InvalidTracerEventError extends Error {

	constructor(event: string) {
		super(`Invalid event (${event}), allowed only (call and return)`);
	}
}