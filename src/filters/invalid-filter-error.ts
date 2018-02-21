
export class InvalidFilterError extends Error {

    public constructor(filter: string) {
        super(`Invalid filter (${filter})`);
    }
}
