export default abstract class Filter {
    
    constructor(protected apiName: string) {

    }
    
    abstract apply(value: any): boolean;
    abstract toSQLWhereClause(): string;

    filter(object: any) {
        const value = this.getValue(object);
        return this.apply(value);
    }

    static filter(objects: any[], filter: Filter) {
        return objects.filter(filter.filter);
    }

    getValue(object: any) {
        // todo: support deep dot annotation
        return object[this.apiName];
    }
}