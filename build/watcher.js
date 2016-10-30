"use strict";
const events_1 = require('events');
const proxy_1 = require('./proxy');
class Watcher extends events_1.EventEmitter {
    build() {
        return (planAndResolve) => {
            return (planAndResolveArgs) => {
                return planAndResolve(planAndResolveArgs).map((object) => {
                    return proxy_1.setup(object, (className, methodName, args) => {
                        this.emit('call', className, methodName, args);
                    }, (className, methodName, result) => {
                        this.emit('return', className, methodName, result);
                    });
                });
            };
        };
    }
}
exports.Watcher = Watcher;
//# sourceMappingURL=watcher.js.map