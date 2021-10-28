import Filter from './filter';
import { NumberOperation } from '../json-filter';
import esb, { Query } from 'elastic-builder';

export class NumberFilter extends Filter {
    constructor(apiName: string, private operation: NumberOperation, private filterValues: number[] = []) {
        super(apiName);
    }

    apply(value: any): boolean {
        switch (this.operation) {
            case 'IsEmpty':
                return value == undefined;
            case 'IsNotEmpty':
                return value != undefined;
            case 'IsEqual':
                return this.filterValues.find((x) => value === x) !== undefined;
            case 'IsNotEqual':
                return this.filterValues.find((x) => value === x) === undefined;
            case '=':
                return value === this.filterValues[0];
            case '!=':
                return value !== this.filterValues[0];
            case '>':
                return value > this.filterValues[0];
            case '>=':
                return value >= this.filterValues[0];
            case '<':
                return value < this.filterValues[0];
            case '<=':
                return value <= this.filterValues[0];
            case 'Between':
                return value >= this.filterValues[0] && value <= this.filterValues[1];
        }
    }
    toSQLWhereClause(): string {
        switch (this.operation) {
            case 'IsEmpty':
                return `${this.apiName} IS NULL`;
            case 'IsNotEmpty':
                return `${this.apiName} IS NOT NULL`;
            case 'IsEqual':
                return `${this.apiName} IN (${this.filterValues.map((val) => val.toString()).join(', ')})`;
            case 'IsNotEqual':
                return `${this.apiName} NOT IN (${this.filterValues.map((val) => val.toString()).join(', ')})`;
            case '=':
                return `${this.apiName} = ${this.filterValues[0]}`;
            case '!=':
                return `${this.apiName} != ${this.filterValues[0]}`;
            case '>':
                return `${this.apiName} > ${this.filterValues[0]}`;
            case '>=':
                return `${this.apiName} >= ${this.filterValues[0]}`;
            case '<':
                return `${this.apiName} < ${this.filterValues[0]}`;
            case '<=':
                return `${this.apiName} <= ${this.filterValues[0]}`;
            case 'Between':
                return `${this.apiName} >= ${this.filterValues[0]} AND ${this.apiName} <= ${this.filterValues[0]}`;
        }
    }

    toKibanaFilter(): Query {
        const existsFilter = esb.existsQuery(`${this.apiName}`);
        const termQueryValue = esb.termQuery(`${this.apiName}.keyword`, this.filterValues[0]);
        const rangeQuery = esb.rangeQuery(`${this.apiName}`);

        const termsQueryValues = esb.termsQuery(
            `${this.apiName}.keyword`,
            this.filterValues.map((val) => val.toString()),
        );

        const res = esb.boolQuery();
        switch (this.operation) {
            case 'IsEmpty':
                return res.mustNot(existsFilter);
            case 'IsNotEmpty':
                return res.must(existsFilter);
            case 'IsEqual':
                return res.must(termsQueryValues);
            case 'IsNotEqual':
                return res.mustNot(termsQueryValues);
            case '=':
                return res.must(termQueryValue);
            case '!=':
                return res.mustNot(termQueryValue);
            case '>':
                return rangeQuery.gt(this.filterValues[0]);
            case '>=':
                return rangeQuery.gte(this.filterValues[0]);
            case '<':
                return rangeQuery.lt(this.filterValues[0]);
            case '<=':
                return rangeQuery.lte(this.filterValues[0]);
            case 'Between':
                return rangeQuery.lte(this.filterValues[0]).gte(this.filterValues[0]);
        }
    }
}
