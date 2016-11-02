"use strict";
class InvalidFilterException extends Error {
    constructor(filter) {
        super(`Invalid filter (${filter})`);
    }
}
exports.InvalidFilterException = InvalidFilterException;
//# sourceMappingURL=errors.js.map