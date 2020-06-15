import { JSONFilter, FieldType } from './json-filter';
import { FilterFactory } from './filters/filter-factory';
import Filter from './filters/filter';
import { SQLWhereParser } from './sql-where-parser';
import { JSONFilterTransformer, NodeTransformer } from './json-filter-transformer';
import { combineWhereClauses, combineJSONFilters } from './converters';

/**
 * Concat two JSON Filters by combining them into one
 * @param f1 A JSONFilter
 * @param f2 Another JSON Filter
 * @param and use and operation. `true` by default.
 */
export function concat(f1: JSONFilter | undefined, f2: JSONFilter | undefined, and: boolean): JSONFilter | undefined;

/**
 * Concat two Api query strings by combining them into one
 * @param f1 A where clause
 * @param f2 Another where clause
 * @param and use and operation. `true` by default.
 */
export function concat(s1: string | undefined, s2: string | undefined, and: boolean): string;

export function concat(
    f1: JSONFilter | string | undefined,
    f2: JSONFilter | string | undefined,
    and = true,
): JSONFilter | string | undefined {
    if (typeof f1 === 'string' && typeof f2 === 'string') {
        return combineWhereClauses(f1, f2, and);
    } else if (typeof f1 === 'object' && typeof f2 === 'object') {
        return combineJSONFilters(f1, f2, and);
    }

    throw new Error('Invalid parameters');
}

export function parse(where: string, fields: { [key: string]: FieldType }) {
    if (where) {
        const parser = new SQLWhereParser(fields);
        return parser.parse(where);
    }
    return undefined;
}

export function transform(jsonFilter: JSONFilter | undefined, transformations: { [key: string]: NodeTransformer }) {
    if (jsonFilter) {
        const transformer = new JSONFilterTransformer(transformations);
        return transformer.transform(jsonFilter);
    }
    return undefined;
}

export function toApiQueryString(jsonFilter: JSONFilter | undefined) {
    if (jsonFilter) {
        const filterFactory = new FilterFactory();
        const filter = filterFactory.createFilter(jsonFilter);
        return filter.toSQLWhereClause();
    }
    return undefined;
}

export function filter<T>(objects: T[], jsonFilter: JSONFilter | undefined): T[] {
    if (jsonFilter) {
        const filterFactory = new FilterFactory();
        const filter = filterFactory.createFilter(jsonFilter);
        return Filter.filter(objects, filter);
    }
    return objects;
}

export * from './json-filter';
