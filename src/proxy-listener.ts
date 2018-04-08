
import { EventEmitter } from 'events';
import { MethodFilter } from './method-filter';

const STRIP_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/mg;
const ARGUMENT_NAMES = /([^\s,]+)/g;

const CONSTRUCTOR_NAME = 'constructor';

function getParamNames(func: () => void): string[] {
    const fnStr = func.toString().replace(STRIP_COMMENTS, '');
    return fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES) || [];
}

export interface Parameter {

    /**
     * Parameter name
     *
     * @type {string}
     * @memberof Parameter
     */
    name: string;

    /**
     * Parameter value
     *
     * @type {*}
     * @memberof Parameter
     */
    value: any;
}

export interface CallInfo {

    /**
     * Class name
     *
     * @type {string}
     * @memberof CallInfo
     */
    className: string;

    /**
     * Method name
     *
     * @type {string}
     * @memberof CallInfo
     */
    methodName: string;

    /**
     * Parameters passed to the method
     *
     * @type {Parameter[]}
     * @memberof CallInfo
     */
    parameters: Parameter[];
}

export interface ReturnInfo {

    /**
     * Class name
     *
     * @type {string}
     * @memberof ReturnInfo
     */
    className: string;

    /**
     * Method name
     *
     * @type {string}
     * @memberof ReturnInfo
     */
    methodName: string;

    /**
     * Returned value
     *
     * @type {*}
     * @memberof ReturnInfo
     */
    result: any;
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

        if (!(object instanceof Object)) {
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
            if (typeof (object[propertyName]) === 'function' && propertyName !== CONSTRUCTOR_NAME) {
                methods.push(propertyName);
            }
        });

        methods = methods.filter((methodName: string) => {
            return self.methodFilter.match(object.constructor.name, methodName);
        });

        methods.forEach((methodName: string) => {

            const parameters = getParamNames(object[methodName]);
            const method = object[methodName];

            // tslint:disable-next-line:only-arrow-functions
            object[methodName] = function() {

                const args = Array.from(arguments);

                const tempArguments: any[] = args.length >= parameters.length ? args : args.concat(new Array(parameters.length - args.length));
                const tempParameters: string[] =
                    args.length > parameters.length ? parameters.concat(new Array(args.length - parameters.length)) : parameters;

                const callParameters = [];

                for (let i = 0; i < tempParameters.length; i++) {
                    callParameters.push({
                        name: tempParameters[i],
                        value: tempArguments[i]
                    } as Parameter);
                }

                self.emitter.emit('call', {
                    className: object.constructor.name,
                    methodName,
                    parameters: callParameters
                } as CallInfo);

                const result = method.apply(object, arguments);

                if (self.options.inspectReturnedPromise && result instanceof Promise) {

                    return result.then((value: any) => {
                        self.emitter.emit('return', { className: object.constructor.name, methodName, result: value } as ReturnInfo);
                        return Promise.resolve(value);
                    }).catch((error: any) => {
                        self.emitter.emit('return', { className: object.constructor.name, methodName, result: error } as ReturnInfo);
                        return Promise.reject(error);
                    });

                } else {
                    self.emitter.emit('return', { className: object.constructor.name, methodName, result } as ReturnInfo);
                    return result;
                }
            };
        });
    }
}
