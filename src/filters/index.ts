
import { filterRegex } from './constants';
import { InvalidFilterException } from './../errors';

export * from './class';
export * from './method';

export function normalizeFilters(filters: string[]): string[] {

	return filters.map((filter: string) => {

		const values = filter.match(filterRegex);

		if (!values) throw new InvalidFilterException(filter);

		return `${values[1]}:${values[2] || '*'}`;
	});
}