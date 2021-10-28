import Filter from './filter';
import { DateOperation } from '../json-filter';
import esb, { Query, termQuery } from 'elastic-builder';

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
                return `${this.apiName} = '${this.apiDateValue(this.filterValues[0])}'`;
            case '!=':
                return `${this.apiName} != '${this.apiDateValue(this.filterValues[0])}'`;
            case '>':
                return `${this.apiName} > '${this.apiDateValue(this.filterValues[0])}'`;
            case '>=':
                return `${this.apiName} >= '${this.apiDateValue(this.filterValues[0])}'`;
            case '<':
                return `${this.apiName} < '${this.apiDateValue(this.filterValues[0])}'`;
            case '<=':
                return `${this.apiName} <= '${this.apiDateValue(this.filterValues[0])}'`;
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

    apiDateValue(val: string): string {
        let res = new Date(val).toISOString();

        // get rid of ms at the end - API doesn't support this
        res = res.split('.')[0] + 'Z';

        return res;
    }

    toKibanaFilter(): Query {
        const filterVal = this.filterValues[0];
        const existsFilter = esb.existsQuery(`${this.apiName}`);
        const boolQuery = esb.boolQuery();
        const rangeQuery = esb.rangeQuery();
        const termQueryValue = esb.termQuery(`${this.apiName}.keyword`, filterVal);

        switch (this.operation) {
            case 'IsEmpty':
                return boolQuery.mustNot(existsFilter);
            case 'IsNotEmpty':
                return boolQuery.must(existsFilter);
            case '=':
                return boolQuery.must(termQueryValue);
            case '!=':
                return boolQuery.mustNot(termQueryValue);
            case '>':
                return rangeQuery.gt(filterVal);
            case '>=':
                return rangeQuery.gte(filterVal);
            case '<':
                return rangeQuery.lt(filterVal);
            case '<=':
                return rangeQuery.lte(filterVal);
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
