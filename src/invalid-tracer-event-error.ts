
export class InvalidTracerEventError extends Error {

    public constructor(event: string) {
        super(`Invalid event (${event}), allowed only (call and return)`);
    }
}
