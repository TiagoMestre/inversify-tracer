"use strict";
const base_1 = require('./base');
const constants_1 = require('./constants');
class ClassFilter extends base_1.BaseFilter {
    constructor(filters) {
        super(filters.filter((filter) => constants_1.includeRegex.test(filter)).map((filter) => {
            return filter.match(constants_1.classIncludeRegex)[1];
        }), filters.filter((filter) => constants_1.excludeRegex.test(filter)).map((filter) => {
            return filter.match(constants_1.classExcludeRegex)[1];
        }));
    }
    match(className) {
        return super.baseMatch(className);
    }
}
exports.ClassFilter = ClassFilter;
//# sourceMappingURL=class.js.map