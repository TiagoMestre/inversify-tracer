"use strict";
const events_1 = require('events');
const filters_1 = require('./filters');
const errors_1 = require('./errors');
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
class InversifyTracer {
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
        if (eventName !== 'call' && eventName !== 'return') {
            throw new errors_1.InvalidTracerEventError(eventName);
        }
        this.emitter.on(eventName, callback);
        return this;
    }
    apply(kernel) {
        kernel._bindingDictionary._dictionary.forEach((keyValuePair) => {
            keyValuePair.value.forEach((binding) => {
                if (binding.cache) {
                    console.log('cache: ' + binding.cache.constructor.name);
                    return this.proxyListener.apply(binding.cache);
                }
                binding.onActivation = (context, target) => {
                    if (this.classFilter.match(target.constructor.name)) {
                        this.proxyListener.apply(target);
                    }
                    return target;
                };
            });
        });
    }
}
exports.InversifyTracer = InversifyTracer;
//# sourceMappingURL=tracer.js.map