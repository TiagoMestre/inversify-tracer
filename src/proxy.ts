
import { EventEmitter } from 'events';
import { MethodFilter } from './filters';

const STRIP_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/mg;
const ARGUMENT_NAMES = /([^\s,]+)/g;

const constructorName = 'constructor';

function getParamNames(func: () => void) {
    const fnStr = func.toString().replace(STRIP_COMMENTS, '');
    return fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES) || [];
}

export interface ProxyListenerOptions {
    inspectReturnedPromise: boolean;
}

export class ProxyListener {

    private emitter: EventEmitter;
    private methodFilter: MethodFilter;

    private options: ProxyListenerOptions;

    public constructor(emitter: EventEmitter, methodFilter: MethodFilter, options: ProxyListenerOptions) {
        this.emitter = emitter;
        this.methodFilter = methodFilter;
        this.options = options;
    }

    public apply(object: any) {

        if (!(object instanceof Object) || object instanceof Array) {
            return;
        }

        const self = this;
        const properties: Set<string> = new Set<string>();
        let obj = object;

        while (Object.getPrototypeOf(obj)) {

            Object.getOwnPropertyNames(obj).forEach((propertyName) => {
                properties.add(propertyName);
            });

            obj = Object.getPrototypeOf(obj);
        }

        let methods: string[] = [];

        properties.forEach((propertyName: string) => {
            if (typeof (object[propertyName]) === 'function' && propertyName !== constructorName) {
                methods.push(propertyName);
            }
        });

        methods = methods.filter((methodName: string) => {
            return self.methodFilter.match(object.constructor.name, methodName);
        });

        methods.forEach((methodName: string) => {

            const parameters = getParamNames(object[methodName]);
            const method = object[methodName];

            object[methodName] = () => {

                const args = Array.from(arguments).map((argument: any) => {
                    return typeof (argument) === 'function' ? '<Function>' : argument;
                });

                self.emitter.emit('call', {
                    className: object.constructor.name,
                    methodName,
                    arguments: arguments.length > parameters.length ? args : args.concat(new Array(parameters.length - args.length)),
                    parameters
                });

                const result = method.apply(object, arguments);

                if (self.options.inspectReturnedPromise && result instanceof Promise) {

                    return result.then((value: any) => {
                        self.emitter.emit('return', { className: object.constructor.name, methodName, result: value });
                        return Promise.resolve(value);
                    }).catch((error: any) => {
                        self.emitter.emit('return', { className: object.constructor.name, methodName, result: error });
                        return Promise.reject(error);
                    });

                } else {
                    self.emitter.emit('return', { className: object.constructor.name, methodName, result });
                    return result;
                }
            };
        });
    }
}
