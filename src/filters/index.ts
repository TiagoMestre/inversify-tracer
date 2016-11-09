
import { filterRegex } from './constants';
import { InvalidFilterError } from './../errors';

export * from './class';
export * from './method';

export function normalizeFilters(filters: string[]): string[] {

	return filters.map((filter: string) => {

		const values = filter.match(filterRegex);

		if (!values) throw new InvalidFilterError(filter);

		return `${values[1]}:${values[2] || '*'}`;
	});
}