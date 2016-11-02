"use strict";
const minimatch = require('minimatch');
class BaseFilter {
    constructor(includeFilters, excludeFilters) {
        this.cache = new Map();
        this.includeFilters = includeFilters;
        this.excludeFilters = excludeFilters;
    }
    baseMatch(matchValue) {
        if (this.cache.has(matchValue))
            return this.cache.get(matchValue);
        let result = false;
        for (let i = 0; i < this.includeFilters.length; i++) {
            if (minimatch(matchValue, this.includeFilters[i])) {
                result = true;
                break;
            }
        }
        if (!result) {
            this.cache.set(matchValue, result);
            return result;
        }
        for (let i = 0; i < this.excludeFilters.length; i++) {
            if (minimatch(matchValue, this.excludeFilters[i], { flipNegate: true })) {
                result = false;
                break;
            }
        }
        this.cache.set(matchValue, result);
        return result;
    }
}
exports.BaseFilter = BaseFilter;
//# sourceMappingURL=base.js.map