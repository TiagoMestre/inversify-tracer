"use strict";
const STRIP_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/mg;
const ARGUMENT_NAMES = /([^\s,]+)/g;
function getParamNames(func) {
    const fnStr = func.toString().replace(STRIP_COMMENTS, '');
    return fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES) || [];
}
let idCounter = 0;
function setup(object, onCall, onReturn) {
    const className = object.constructor.name;
    const objectId = idCounter++;
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
        const params = getParamNames(object[methodName]);
        object[methodName] = new Proxy(object[methodName], {
            apply: (method, object, args) => {
                onCall({
                    objectId,
                    className,
                    methodName,
                    arguments: args.length > params.length ? args : args.concat(new Array(params.length - args.length)),
                    parameters: params
                });
                const result = method.apply(object, args);
                onReturn({ objectId, className, methodName, result });
            }
        });
    });
    return object;
}
exports.setup = setup;
//# sourceMappingURL=proxy.js.map