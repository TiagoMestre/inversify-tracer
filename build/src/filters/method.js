"use strict";
const base_1 = require('./base');
const constants_1 = require('./constants');
class MethodFilter extends base_1.BaseFilter {
    constructor(filters) {
        super(filters.filter((filter) => constants_1.includeRegex.test(filter)), filters.filter((filter) => constants_1.excludeRegex.test(filter)));
    }
    match(className, methodName) {
        return super.baseMatch(`${className}:${methodName}`);
    }
}
exports.MethodFilter = MethodFilter;
//# sourceMappingURL=method.js.map