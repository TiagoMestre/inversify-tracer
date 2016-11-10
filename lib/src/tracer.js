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
        for (let i in kernel._bindingDictionary._dictionary) {
            for (let j in kernel._bindingDictionary._dictionary[i].value) {
                console.log(kernel._bindingDictionary._dictionary[i].value[j].serviceIdentifier);
                if (kernel._bindingDictionary._dictionary[i].value[j].cache) {
                    return this.proxyListener.apply(kernel._bindingDictionary._dictionary[i].value[j].cache);
                }
                kernel._bindingDictionary._dictionary[i].value[j].onActivation = (context, target) => {
                    if (this.classFilter.match(target.constructor.name)) {
                        this.proxyListener.apply(target);
                    }
                    return target;
                };
            }
        }
    }
}
exports.InversifyTracer = InversifyTracer;
//# sourceMappingURL=tracer.js.map