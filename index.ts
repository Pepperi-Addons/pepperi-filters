import { JSONFilter, FieldType } from './json-filter'
import { FilterFactory } from './filters/filter-factory'
import Filter from './filters/filter'
import { SQLWhereParser } from './sql-where-parser'
import { JSONFilterTransformer, JSONFilterNodeTransformer } from './json-filter-transformer'

export * from './json-filter'

export function concat(f1: JSONFilter, f2: JSONFilter, and: boolean = true): JSONFilter {
    return {
        Operation: and ? 'AND' : 'OR',
        LeftNode: f1, 
        RightNode: f2
    };
}

export function parse(where: string, fields: Map<string, FieldType>) {
    const arr: { FieldType: FieldType, FieldName: string }[] = [];
    fields.forEach((value, key) => {
        arr.push({
            FieldName: key,
            FieldType: value
        });
    });

    const parser = new SQLWhereParser(arr);
    return parser.parse(where);
}

export function transform(jsonFilter: JSONFilter, transformations: Map<string, JSONFilterNodeTransformer>) {
    const transformer = new JSONFilterTransformer(transformations);
    return transformer.transform(jsonFilter);
}

export function sqlWhereClause(jsonFilter: JSONFilter) {
    const filterFactory = new FilterFactory();
    const filter = filterFactory.createFilter(jsonFilter);
    return filter.toSQLWhereClause();
}

export function filter<T>(objects: T[], jsonFilter: JSONFilter): T[] {
    const filterFactory = new FilterFactory();
    const filter = filterFactory.createFilter(jsonFilter);
    return Filter.filter(objects, filter);
}