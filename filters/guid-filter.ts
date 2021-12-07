import Filter from './filter';
import { BasicOperations } from '../json-filter';
const emptyGuid = '00000000-0000-0000-0000-000000000000';
import esb, { Query } from 'elastic-builder';

export class GuidFilter extends Filter {
    constructor(apiName: string, private operation: BasicOperations, private filterValue: string) {
        super(apiName);
    }

    apply(value: any): boolean {
        switch (this.operation) {
            case 'IsEmpty':
                return this.standardize(value) === this.standardize(emptyGuid);
            case 'IsNotEmpty':
                return this.standardize(value) !== this.standardize(emptyGuid);
            case 'IsEqual':
                return this.standardize(value) === this.standardize(this.filterValue);
            case 'IsNotEqual':
                return this.standardize(value) !== this.standardize(this.filterValue);
        }
    }

    standardize(guid: any) {
        return (typeof guid === 'string' && guid ? guid : emptyGuid).toLowerCase().replace(/-/g, '');
    }

    toSQLWhereClause(): string {
        const filterVal = (this.filterValue || emptyGuid).toLowerCase();

        switch (this.operation) {
            case 'IsEmpty':
                return `${this.apiName} IS NULL OR ${this.apiName} = '${emptyGuid}'`;
            case 'IsNotEmpty':
                return `${this.apiName} IS NOT NULL AND ${this.apiName} != '${emptyGuid}'`;
            case 'IsEqual':
                return `${this.apiName} = '${filterVal}'`;
            case 'IsNotEqual':
                return `${this.apiName} != '${filterVal}'`;
        }
    }

    toKibanaFilter(): Query {
        const filterVal = (this.filterValue || emptyGuid).toLowerCase();
        const existsFilter = esb.existsQuery(`${this.apiName}`);
        const termQueryEmpty = esb.termQuery(`${this.apiName}`, emptyGuid);
        const termQueryValue = esb.termQuery(`${this.apiName}`, filterVal);

        const res = esb.boolQuery();
        switch (this.operation) {
            case 'IsEmpty':
                res.should([esb.boolQuery().mustNot(existsFilter), esb.boolQuery().must(termQueryEmpty)]);
                break;
            case 'IsNotEmpty':
                res.mustNot(termQueryEmpty).must(existsFilter);
                break;
            case 'IsEqual':
                res.must(termQueryValue);
                break;
            case 'IsNotEqual':
                res.mustNot(termQueryValue);
                break;
        }
        return res;
    }
}
