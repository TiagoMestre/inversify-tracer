
export class InvalidTracerEventError extends Error {

    public constructor(event: string) {
        super(`invalid event \"${event}\", only allowed (call and return)`);
        this.name = this.constructor.name;
    }
}
