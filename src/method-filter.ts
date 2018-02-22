
import { BaseFilter } from './base-filter';
import { includeRegex, excludeRegex } from './constants';

export class MethodFilter extends BaseFilter {

    public constructor(filters: string[]) {
        super(
            filters.filter((filter) => includeRegex.test(filter)),
            filters.filter((filter) => excludeRegex.test(filter))
        );
    }

    public match(className: string, methodName: string): boolean {
        return super.baseMatch(`${className}:${methodName}`);
    }
}
