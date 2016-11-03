"use strict";
const STRIP_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/mg;
const ARGUMENT_NAMES = /([^\s,]+)/g;
const constructorName = 'constructor';
function getParamNames(func) {
    const fnStr = func.toString().replace(STRIP_COMMENTS, '');
    return fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES) || [];
}
class ProxyListener {
    constructor(emitter, methodFilter, options) {
        this.idCounter = 0;
        this.emitter = emitter;
        this.methodFilter = methodFilter;
        this.options = options;
    }
    apply(object) {
        const className = object.constructor.name;
        const objectId = this.idCounter++;
        let properties = new Set();
        let obj = object;
        while (Object.getPrototypeOf(obj) !== null) {
            Object.getOwnPropertyNames(obj).forEach((propertyName) => {
                properties.add(propertyName);
            });
            obj = Object.getPrototypeOf(obj);
        }
        let methods = [];
        properties.forEach((propertyName) => {
            if (typeof (object[propertyName]) === 'function' && propertyName !== constructorName) {
                methods.push(propertyName);
            }
        });
        methods.filter((methodName) => {
            return this.methodFilter.match(className, methodName);
        });
        methods.forEach((methodName) => {
            const params = getParamNames(object[methodName]);
            object[methodName] = new Proxy(object[methodName], {
                apply: (method, object, args) => {
                    this.emitter.emit('call', {
                        objectId,
                        className,
                        methodName,
                        arguments: args.length > params.length ? args : args.concat(new Array(params.length - args.length)),
                        parameters: params
                    });
                    const result = method.apply(object, args);
                    if (this.options.inspectReturnedPromise && result instanceof Promise) {
                        return result.then((value) => {
                            this.emitter.emit('return', { objectId, className, methodName, result: value });
                            return Promise.resolve(value);
                        }).catch((error) => {
                            this.emitter.emit('return', { objectId, className, methodName, error });
                            return Promise.reject(error);
                        });
                    }
                    else {
                        this.emitter.emit('return', { objectId, className, methodName, result });
                        return result;
                    }
                }
            });
        });
    }
}
exports.ProxyListener = ProxyListener;
//# sourceMappingURL=proxy.js.map