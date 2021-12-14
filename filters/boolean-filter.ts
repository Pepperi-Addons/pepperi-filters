import Filter from './filter';
import { str2Bool } from '../converters';
import esb, { Query } from 'elastic-builder';

export class BooleanFilter extends Filter {
    constructor(apiName: string, private filterValue: boolean) {
        super(apiName);
    }

    apply(value: any): boolean {
        let boolVal: boolean;

        // for strings we go with the CPI definition of bool
        if (typeof value === 'string') {
            boolVal = str2Bool(value);
        } else {
            // for the rest of the types we will go with JS definition of truely values
            boolVal = Boolean(value);
        }

        return boolVal === this.filterValue;
    }
    toSQLWhereClause(): string {
        return `${this.apiName} = ${this.filterValue ? '1' : '0'}`;
    }

    toKibanaFilter(): Query {
        const value = this.filterValue ? 'true' : 'false';
        return esb.termQuery(`${this.apiName}`, value);
    }
}
