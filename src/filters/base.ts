
import * as minimatch from 'minimatch';

import { includeRegex, excludeRegex } from './constants';

export abstract class BaseFilter {

	private includeFilters: string[];
	private excludeFilters: string[];

	private cache: Map<string, boolean> =  new Map<string, boolean>();

	constructor(includeFilters: string[], excludeFilters: string[]) {
		this.includeFilters = includeFilters;
		this.excludeFilters = excludeFilters;
	}

	protected baseMatch(matchValue: string): boolean {

		if (this.cache.has(matchValue)) return this.cache.get(matchValue);

		let result = false;

		for (let i = 0; i < this.includeFilters.length; i++) {
			if (minimatch(matchValue, this.includeFilters[i])) {
				result = true;
				break;
			}
		}

		if (!result) {
			this.cache.set(matchValue, result);
			return result;
		}

		for (let i = 0; i < this.excludeFilters.length; i++) {
			if (minimatch(matchValue, this.excludeFilters[i], { flipNegate: true })) {
				result = false;
				break;
			}
		}

		this.cache.set(matchValue, result);
		return result;
	}
}
