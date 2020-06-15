import Filter from './filter';
import { BasicOperations } from '../json-filter';
const emptyGuid = '00000000-0000-0000-0000-000000000000';

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
}
