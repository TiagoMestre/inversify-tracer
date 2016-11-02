
export const filterRegex: RegExp = /^(!?[^:]+):?([^:]+)?$/;

export const includeRegex: RegExp = /^[^!](.+)$/;
export const excludeRegex: RegExp = /^!(.+)$/;

export const classIncludeRegex: RegExp = /^([^:]+):.+$/;
export const classExcludeRegex: RegExp = /^(![^:]+):\*$/;