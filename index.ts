import { JSONFilter, FieldType } from './json-filter';
import { FilterFactory } from './filters/filter-factory';
import Filter from './filters/filter';
import { SQLWhereParser } from './sql-where-parser';
import { JSONFilterTransformer, NodeTransformer } from './json-filter-transformer';
import esb, { Query } from 'elastic-builder';
import { DynamoResultObject } from './filters/DynamoObjectResult';

/**
 * Concat two JSON Filters by combining them into one
 * @param f1 A JSONFilter
 * @param f2 Another JSON Filter
 * @param and use and operation. `true` by default.
 */
export function concat(and: boolean, f1: JSONFilter, ...args: (JSONFilter | undefined)[]): JSONFilter | undefined;

/**
 * Concat two Api query strings by combining them into one
 * @param f1 A where clause
 * @param f2 Another where clause
 * @param and use and operation. `true` by default.
 */
export function concat(and: boolean, s1: string, ...args: (string | undefined)[]): string;

export function concat(
    and: boolean,
    f1: JSONFilter | string,
    ...args: (JSONFilter | string | undefined)[]
): JSONFilter | string | undefined {
    if (typeof f1 === 'string') {
        const expressions = [f1, args as (string | undefined)[]].flat().filter(Boolean) as string[];
        if (expressions.length === 0) {
            return '';
        }
        if (expressions.length === 1) {
            return expressions[0];
        }
        return `(${expressions.join(` ${and ? 'AND' : 'OR'} `)})`;
    } else if (typeof f1 === 'object') {
        return [f1, args as (JSONFilter | undefined)[]]
            .flat()
            .filter(Boolean)
            .reduce((left, right) => {
                return {
                    Operation: and ? 'AND' : 'OR',
                    LeftNode: left,
                    RightNode: right,
                } as JSONFilter;
            });
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

export function toKibanaQuery(jsonFilter: JSONFilter | undefined): esb.Query {
    if (jsonFilter) {
        const filterFactory = new FilterFactory();
        const filter = filterFactory.createFilter(jsonFilter);
        return filter.toKibanaFilter();
    }
    throw new Error('jsonFilter is a mandatory parameter');
}

export function toKibanaQueryJSON(jsonFilter: JSONFilter | undefined) {
    if (jsonFilter) {
        const filterFactory = new FilterFactory();
        const filter = filterFactory.createFilter(jsonFilter);
        return filter.toKibanaFilter().toJSON();
    }
    throw new Error('jsonFilter is a mandatory parameter');
}

export function toDynamoDBQuery(
    jsonFilter: JSONFilter | undefined,
    letterForMark: string,
    expressionAttributeNames: any,
    expressionAttributeValues: any,
    count: number,
): DynamoResultObject {
    if (jsonFilter) {
        const filterFactory = new FilterFactory();
        const filter = filterFactory.createFilter(jsonFilter);
        return filter.toDynamoDBQuery(letterForMark, expressionAttributeNames, expressionAttributeValues, count);
    }
    throw new Error('jsonFilter is a mandatory parameter');
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
