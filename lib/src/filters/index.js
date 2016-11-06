function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
const constants_1 = require('./constants');
const errors_1 = require('./../errors');
__export(require('./class'));
__export(require('./method'));
function normalizeFilters(filters) {
    return filters.map((filter) => {
        const values = filter.match(constants_1.filterRegex);
        if (!values)
            throw new errors_1.InvalidFilterError(filter);
        return `${values[1]}:${values[2] || '*'}`;
    });
}
exports.normalizeFilters = normalizeFilters;
//# sourceMappingURL=index.js.map