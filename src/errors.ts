

export class InvalidFilterException extends Error {
	
	constructor(filter: string) {
		super(`Invalid filter (${filter})`);
	}
}