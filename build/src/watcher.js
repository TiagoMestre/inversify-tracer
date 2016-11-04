const events_1 = require('events');
const filters_1 = require('./filters');
const proxy_1 = require('./proxy');
const defaultOptions = {
    filters: ['*:*'],
    inspectReturnedPromise: true
};
function merge(base, newObj) {
    for (let prop in newObj) {
        base[prop] = base[prop] || newObj[prop];
    }
    return base;
}
class InversifyWatcher {
    constructor(options) {
        this.emitter = new events_1.EventEmitter();
        if (options) {
            options = merge(options, defaultOptions);
        }
        else {
            options = defaultOptions;
        }
        options.filters = filters_1.normalizeFilters(options.filters);
        this.classFilter = new filters_1.ClassFilter(options.filters);
        this.proxyListener = new proxy_1.ProxyListener(this.emitter, new filters_1.MethodFilter(options.filters), {
            inspectReturnedPromise: options.inspectReturnedPromise
        });
    }
    on(eventName, callback) {
        this.emitter.on(eventName, callback);
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