import Filter from "./filter";

export class BooleanFilter extends Filter {
    
    constructor(apiName: string, private filterValue: boolean) {
        super(apiName);
    }
    
    apply(value: any): boolean {
        return value == this.filterValue;
    }
    toSQLWhereClause(): string {
        return `${this.apiName} = ${this.filterValue ? 'true' : 'false'}`;
    }

}