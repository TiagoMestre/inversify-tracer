"use strict";
const base_1 = require('./base');
const constants_1 = require('./constants');
const classIncludeRegex = /^([A-Z|a-z|0-9|\_|\$|\*]+):.+$/;
const classExcludeRegex = /^(![A-Z|a-z|0-9|\_|\$\*]+):\*$/;
class ClassFilter extends base_1.BaseFilter {
    constructor(filters) {
        super(filters.filter((filter) => constants_1.includeRegex.test(filter)).map((filter) => {
            return filter.match(classIncludeRegex)[1];
        }), filters.filter((filter) => classExcludeRegex.test(filter)).map((filter) => {
            return filter.match(classExcludeRegex)[1];
        }));
    }
    match(className) {
        return super.baseMatch(className);
    }
}
exports.ClassFilter = ClassFilter;
//# sourceMappingURL=class.js.map