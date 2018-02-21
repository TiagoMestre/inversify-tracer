
import * as minimatch from 'minimatch';

export abstract class BaseFilter {

    private includeFilters: string[];
    private excludeFilters: string[];

    private cache: Map<string, boolean> = new Map<string, boolean>();

    public constructor(includeFilters: string[], excludeFilters: string[]) {
        this.includeFilters = includeFilters;
        this.excludeFilters = excludeFilters;
    }

    protected baseMatch(matchValue: string): boolean {

        if (this.cache.has(matchValue)) {
            return this.cache.get(matchValue);
        }

        let result = false;

        for (const index in this.includeFilters) {
            if (minimatch(matchValue, this.includeFilters[index])) {
                result = true;
                break;
            }
        }

        if (!result) {
            this.cache.set(matchValue, result);
            return result;
        }

        for (const index in this.excludeFilters) {
            if (minimatch(matchValue, this.excludeFilters[index], { flipNegate: true })) {
                result = false;
                break;
            }
        }

        this.cache.set(matchValue, result);
        return result;
    }
}
