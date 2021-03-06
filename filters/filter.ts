export default abstract class Filter {
    constructor(protected apiName: string) {}

    abstract apply(value: any): boolean;
    abstract toSQLWhereClause(): string;

    filter(object: any) {
        const value = this.getValue(object, this.apiName);
        return this.apply(value);
    }

    static filter(objects: any[], filter: Filter) {
        return objects.filter((obj) => filter.filter(obj));
    }

    getValue(object: any, apiName: string): any {
        if (!apiName) {
            return undefined;
        }

        if (typeof object !== 'object') {
            return undefined;
        }

        // support regular APINames & dot anotation
        if (apiName in object) {
            return object[apiName];
        }

        // support nested object & arrays
        apiName = apiName.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        const arr = apiName.split('.');
        return this.getValue(object[arr[0]], arr.slice(1).join('.'));
    }
}
