
import * as minimatch from 'minimatch';

import { BaseFilter } from './base';
import { includeRegex, excludeRegex, classIncludeRegex, classExcludeRegex } from './constants';

export class ClassFilter extends BaseFilter {

	constructor(filters: string[]) {
		super(filters.filter((filter: string) => includeRegex.test(filter)).map((filter: string) => {
			return filter.match(classIncludeRegex)[1];
		}), filters.filter((filter) => excludeRegex.test(filter)).map((filter: string) => {
			return filter.match(classExcludeRegex)[1];
		}));
	}

	public match(className: string): boolean {
		return super.baseMatch(className);
	}
}
