"use strict";
const events_1 = require('events');
const filters_1 = require('./filters');
const proxy_1 = require('./proxy');
const defaultOptions = {
    filters: ['*:*']
};
class InversifyWatcher {
    constructor(options) {
        this.emitter = new events_1.EventEmitter();
        options.filters = filters_1.normalizeFilters(options.filters);
        this.classFilter = new filters_1.ClassFilter(options.filters);
        this.proxyListener = new proxy_1.ProxyListener(this.emitter, new filters_1.MethodFilter(options.filters));
    }
    on(event, callback) {
        this.emitter.on(event, callback);
    }
    build() {
        return (planAndResolve) => {
            return (planAndResolveArgs) => {
                const objects = planAndResolve(planAndResolveArgs);
                const objectsToProxy = objects.filter((object) => {
                    return this.classFilter.match(object.constructor.name);
                });
                objectsToProxy.forEach((object) => {
                    return this.proxyListener.apply(object);
                });
                return objects;
            };
        };
    }
}
exports.InversifyWatcher = InversifyWatcher;
//# sourceMappingURL=watcher.js.map