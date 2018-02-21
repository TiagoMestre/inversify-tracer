
import { BaseFilter } from './base';
import { includeRegex } from './constants';

const classIncludeRegex: RegExp = /^([A-Z|a-z|0-9|\_|\$|\*]+):.+$/;
const classExcludeRegex: RegExp = /^(![A-Z|a-z|0-9|\_|\$\*]+):\*$/;

export class ClassFilter extends BaseFilter {

    public constructor(filters: string[]) {
        super(filters.filter((filter: string) => includeRegex.test(filter)).map((filter: string) => {
            return filter.match(classIncludeRegex)[1];
        }), filters.filter((filter) => classExcludeRegex.test(filter)).map((filter: string) => {
            return filter.match(classExcludeRegex)[1];
        }));
    }

    public match(className: string): boolean {
        return super.baseMatch(className);
    }
}
