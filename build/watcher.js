"use strict";
const events_1 = require('events');
const proxy_1 = require('./proxy');
class Watcher extends events_1.EventEmitter {
    constructor(options) {
        super();
        options = options || {};
        this.options = {
            classes: options.classes
        };
    }
    build() {
        return (planAndResolve) => {
            return (planAndResolveArgs) => {
                return planAndResolve(planAndResolveArgs).map((object) => {
                    if (this.options.classes &&
                        this.options.classes.indexOf(object.constructor.name) === -1) {
                        return object;
                    }
                    return proxy_1.setup(object, (callInfo) => { this.emit('call', callInfo); }, (returnInfo) => { this.emit('return', returnInfo); });
                });
            };
        };
    }
}
exports.Watcher = Watcher;
//# sourceMappingURL=watcher.js.map