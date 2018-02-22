
import { EventEmitter } from 'events';
import { interfaces } from 'inversify';

import { ClassFilter } from './class-filter';
import { MethodFilter } from './method-filter';
import { InvalidFilterError } from './invalid-filter-error';
import { InvalidTracerEventError } from './invalid-tracer-event-error';
import { ProxyListener } from './proxy';

const filterRegex: RegExp = /^(!?[A-Z|a-z|0-9|\_|\$|\*]+):?([A-Z|a-z|0-9|\_|\$|\*]+)?$/;

const defaultOptions: TracerOptions = {
    filters: ['*:*'],
    inspectReturnedPromise: true
};

export interface CallInfo {
    className: string;
    methodName: string;
    arguments: any[];
    parameters: string[];
}

export interface ReturnInfo {
    className: string;
    methodName: string;
    result: any;
}

export interface TracerOptions {
    filters?: string[];
    inspectReturnedPromise?: boolean;
}

export class InversifyTracer {

    private emitter: EventEmitter = new EventEmitter();

    private classFilter: ClassFilter;

    private proxyListener: ProxyListener;

    public constructor(options?: TracerOptions) {

        options = options ? { ...defaultOptions, ...options } : defaultOptions;

        options.filters = this.normalizeFilters(options.filters);

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

    private normalizeFilters(filters: string[]): string[] {

        return filters.map((filter: string) => {

            const values = filter.match(filterRegex);

            if (!values) {
                throw new InvalidFilterError(filter);
            }

            return `${values[1]}:${values[2] || '*'}`;
        });
    }
}
