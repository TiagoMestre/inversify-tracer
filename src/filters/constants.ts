
export const filterRegex: RegExp = /^(!?[A-Z|a-z|0-9|\_|\$|\*]+):?([A-Z|a-z|0-9|\_|\$|\*]+)?$/;

export const includeRegex: RegExp = /^[A-Z|a-z|0-9|\_|\$|\*]+:[A-Z|a-z|0-9|\_|\$|\*]+$/;
export const excludeRegex: RegExp = /^![A-Z|a-z|0-9|\_|\$|\*]+:[A-Z|a-z|0-9|\_|\$|\*]+$/;

export const classIncludeRegex: RegExp = /^([A-Z|a-z|0-9|\_|\$|\*]+):.+$/;
export const classExcludeRegex: RegExp = /^(![A-Z|a-z|0-9|\_|\$\*]+):\*$/;