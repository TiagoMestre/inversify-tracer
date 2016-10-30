"use strict";
function setup(object, onCall, onReturn) {
    const className = object.constructor.name;
    let properties = new Set();
    let obj = object;
    while (Object.getPrototypeOf(obj) !== null) {
        Object.getOwnPropertyNames(obj).forEach((propertyName) => {
            properties.add(propertyName);
        });
        obj = Object.getPrototypeOf(obj);
    }
    const methods = [];
    properties.forEach((propertyName) => {
        if (typeof (object[propertyName]) === 'function')
            methods.push(propertyName);
    });
    methods.forEach((methodName) => {
        object[methodName] = new Proxy(object[methodName], {
            apply: (method, object, args) => {
                onCall(className, methodName, args);
                let result = method.apply(object, args);
                onReturn(className, methodName, result);
            }
        });
    });
    return object;
}
exports.setup = setup;
;
//# sourceMappingURL=proxy.js.map