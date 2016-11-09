const STRIP_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/mg;
const ARGUMENT_NAMES = /([^\s,]+)/g;
const constructorName = 'constructor';
function getParamNames(func) {
    const fnStr = func.toString().replace(STRIP_COMMENTS, '');
    return fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES) || [];
}
class ProxyListener {
    constructor(emitter, methodFilter, options) {
        this.emitter = emitter;
        this.methodFilter = methodFilter;
        this.options = options;
    }
    apply(object) {
        const self = this;
        let properties = new Set();
        let obj = object;
        while (Object.getPrototypeOf(obj)) {
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
        methods = methods.filter((methodName) => {
            return self.methodFilter.match(object.constructor.name, methodName);
        });
        methods.forEach((methodName) => {
            const parameters = getParamNames(object[methodName]);
            const method = object[methodName];
            object[methodName] = function () {
                const args = Array.from(arguments);
                self.emitter.emit('call', {
                    className: object.constructor.name,
                    methodName,
                    arguments: arguments.length > parameters.length ? args : args.concat(new Array(parameters.length - args.length)),
                    parameters
                });
                const result = method.apply(object, arguments);
                if (self.options.inspectReturnedPromise && result instanceof Promise) {
                    return result.then((value) => {
                        self.emitter.emit('return', { className: object.constructor.name, methodName, result: value });
                        return Promise.resolve(value);
                    }).catch((error) => {
                        self.emitter.emit('return', { className: object.constructor.name, methodName, error });
                        return Promise.reject(error);
                    });
                }
                else {
                    self.emitter.emit('return', { className: object.constructor.name, methodName, result });
                    return result;
                }
            };
        });
    }
}
exports.ProxyListener = ProxyListener;
//# sourceMappingURL=proxy.js.map