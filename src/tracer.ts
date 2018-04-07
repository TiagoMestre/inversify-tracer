
import { EventEmitter } from 'events';
import { interfaces } from 'inversify';

import { ClassFilter } from './class-filter';
import { MethodFilter } from './method-filter';
import { InvalidFilterError } from './invalid-filter-error';
import { InvalidTracerEventError } from './invalid-tracer-event-error';
import { ProxyListener } from './proxy-listener';

const filterRegex: RegExp = /^(!?[A-Z|a-z|0-9|\_|\$|\*]+):?([A-Z|a-z|0-9|\_|\$|\*]+)?$/;

const defaultOptions: TracerOptions = {
    filters: ['*:*'],
    inspectReturnedPromise: true
};

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

    public apply(container: any): void {
        container._bindingDictionary._map.forEach((bindings: interfaces.Binding<any>[]) => {
            bindings.forEach((binding: interfaces.Binding<any>) => {
                this.applyToBinding(binding);
            });
        });
    }

    private applyToBinding(binding: interfaces.Binding<any>): void {

        const bindingOnActivation = binding.onActivation;

        binding.onActivation = (context: interfaces.Context, target: any): any => {

            if (bindingOnActivation) { target = bindingOnActivation(context, target); }

            if (this.classFilter.match(target.constructor.name)) {
                this.proxyListener.apply(target);
            }

            return target;
        };
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
