"use strict";
class InvalidFilterError extends Error {
    constructor(filter) {
        super(`Invalid filter (${filter})`);
    }
}
exports.InvalidFilterError = InvalidFilterError;
class InvalidTracerEventError extends Error {
    constructor(event) {
        super(`Invalid event (${event}), allowed only (call and return)`);
    }
}
exports.InvalidTracerEventError = InvalidTracerEventError;
//# sourceMappingURL=errors.js.map