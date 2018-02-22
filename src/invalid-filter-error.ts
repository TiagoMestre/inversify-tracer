
export class InvalidFilterError extends Error {

    public constructor(filter: string) {
        super(`invalid filter \"${filter}\"`);
        this.name = this.constructor.name;
    }
}
