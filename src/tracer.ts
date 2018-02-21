
import { EventEmitter } from 'events';
import { interfaces } from 'inversify';

import { TracerOptions } from './interfaces';
import { normalizeFilters, ClassFilter, MethodFilter } from './filters';
import { InvalidTracerEventError } from './invalid-tracer-event-error';
import { ProxyListener } from './proxy';

const defaultOptions: TracerOptions = {
    filters: ['*:*'],
    inspectReturnedPromise: true
};

function merge(base: any, newObj: any) {

    for (const prop in newObj) {
        base[prop] = base[prop] || newObj[prop];
    }

    return base;
}

export declare type BindingCallback = (binding: interfaces.Binding<any>) => void;

export class InversifyTracer {

    private emitter: EventEmitter = new EventEmitter();

    private classFilter: ClassFilter;

    private proxyListener: ProxyListener;

    public constructor(options?: TracerOptions) {

        if (options) {
            options = merge(options, defaultOptions);
        } else {
            options = defaultOptions;
        }

        options.filters = normalizeFilters(options.filters);

        this.classFilter = new ClassFilter(options.filters);

        this.proxyListener = new ProxyListener(
            this.emitter,
            new MethodFilter(options.filters),
            {
                inspectReturnedPromise: options.inspectReturnedPromise
            }
        );
    }

    public on(eventName: string, callback: any) {

        if (eventName !== 'call' && eventName !== 'return') {
            throw new InvalidTracerEventError(eventName);
        }

        this.emitter.on(eventName, callback);
        return this;
    }

    public apply(kernelOrContainer: any): void {

        if (kernelOrContainer._bindingDictionary._map) {
            return this.applyToContainer(kernelOrContainer);
        }

        this.applyToKernel(kernelOrContainer);
    }

    private applyToBinding(binding: interfaces.Binding<any>): void {
        if (binding.cache) {
            return this.proxyListener.apply(binding.cache);
        }

        binding.onActivation = (context: any, target: any) => {

            if (this.classFilter.match(target.constructor.name)) {
                this.proxyListener.apply(target);
            }

            return target;
        };
    }

    private applyToKernel(kernel: any): void {
        kernel._bindingDictionary._dictionary.forEach((keyValuePair: any) => {
            keyValuePair.value.forEach((binding: interfaces.Binding<any>) => {
                this.applyToBinding(binding);
            });
        });
    }

    private applyToContainer(container: any): void {
        container._bindingDictionary._map.forEach((bindings: interfaces.Binding<any>[]) => {
            bindings.forEach((binding: interfaces.Binding<any>) => {
                this.applyToBinding(binding);
            });
        });
    }
}
