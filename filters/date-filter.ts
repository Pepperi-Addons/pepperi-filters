import Filter from './filter';
import { DateOperation } from '../json-filter';

export class DateFilter extends Filter {
    constructor(apiName: string, private operation: DateOperation, private filterValues: string[]) {
        super(apiName);
    }

    apply(value: any): boolean {
        switch (this.operation) {
            case 'IsEmpty':
                return value === '' || value == undefined;
            case 'IsNotEmpty':
                return value !== '' && value != undefined;
            case '=':
                return new Date(value).getTime() == new Date(this.filterValues[0]).getTime();
            case '!=':
                return new Date(value).getTime() != new Date(this.filterValues[0]).getTime();
            case '>':
                return new Date(value).getTime() > new Date(this.filterValues[0]).getTime();
            case '>=':
                return new Date(value).getTime() >= new Date(this.filterValues[0]).getTime();
            case '<':
                return new Date(value).getTime() < new Date(this.filterValues[0]).getTime();
            case '<=':
                return new Date(value).getTime() <= new Date(this.filterValues[0]).getTime();
            case 'Today':
            case 'ThisWeek':
            case 'ThisMonth':
            case 'On':
            case 'After':
            case 'Before':
            case 'Between':
            case 'InTheLast':
            case 'NotInTheLast':
            case 'DueIn':
            case 'NotDueIn': {
                throw new Error(`Operation ${this.operation} isn't supported`);
            }
        }
    }

    toSQLWhereClause(): string {
        switch (this.operation) {
            case 'IsEmpty':
                return `${this.apiName} IS NULL`;
            case 'IsNotEmpty':
                return `${this.apiName} IS NOT NULL`;
            case '=':
                return `${this.apiName} = '${new Date(this.filterValues[0]).toISOString()}'`;
            case '!=':
                return `${this.apiName} != '${new Date(this.filterValues[0]).toISOString()}'`;
            case '>':
                return `${this.apiName} > '${new Date(this.filterValues[0]).toISOString()}'`;
            case '>=':
                return `${this.apiName} >= '${new Date(this.filterValues[0]).toISOString()}'`;
            case '<':
                return `${this.apiName} < '${new Date(this.filterValues[0]).toISOString()}'`;
            case '<=':
                return `${this.apiName} <= '${new Date(this.filterValues[0]).toISOString()}'`;
            case 'Today':
            case 'ThisWeek':
            case 'ThisMonth':
            case 'On':
            case 'After':
            case 'Before':
            case 'Between':
            case 'InTheLast':
            case 'NotInTheLast':
            case 'DueIn':
            case 'NotDueIn': {
                throw new Error(`Operation ${this.operation} isn't supported`);
            }
        }
    }
}
