import Filter from './filter';
import { JSONDoubleFilter, JSONIntegerFilter, JSONRegularFilter, NumberOperation } from '../json-filter';
import esb, { Query } from 'elastic-builder';
import { DynamoResultObject } from './DynamoObjectResult';
import { NGXNumberFiltersFactory } from '../ngx-filters/ngx-filters-factories/ngx-number-filters-factory';
import { IPepSmartFilterData } from '../ngx-filters/json-to-ngx/ngx-types';

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
                return `${this.apiName} >= ${this.filterValues[0]} AND ${this.apiName} <= ${this.filterValues[1]}`;
        }
    }

    toKibanaFilter(): Query {
        const existsFilter = esb.existsQuery(`${this.apiName}`);
        const termQueryValue = esb.termQuery(`${this.apiName}`, this.filterValues[0]);
        const rangeQuery = esb.rangeQuery(`${this.apiName}`);

        const termsQueryValues = esb.termsQuery(
            `${this.apiName}`,
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

    toNgxFilter(): IPepSmartFilterData {
        if (this.filterValues.length == 0) {
            throw Error(`value must be exist in json number filter !`);
        }
        const isInteger = this.filterValues[0] == Math.floor(this.filterValues[0]);
        const type = isInteger ? 'Integer' : 'Double';
        const filter: JSONIntegerFilter | JSONDoubleFilter = {
            Values: this.filterValues.map((val) => val.toString()),
            ApiName: this.apiName,
            FieldType: type,
            Operation: this.operation,
        };
        return NGXNumberFiltersFactory.create(filter);
    }

    toDynamoDBQuery(
        letterForMark: string,
        expressionAttributeNames: any,
        expressionAttributeValues: any,
        count: number,
    ): DynamoResultObject {
        const res: DynamoResultObject = {
            Count: count,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ResString: '',
        };
        let filterNames = '';
        let markName = '';
        let markValue = '';

        switch (this.operation) {
            case 'IsEmpty':
                res.ResString = `attribute_not_exists (${this.apiName})`;
                res.Count = count;
                return res;
            case 'IsNotEmpty':
                res.ResString = `attribute_exists (${this.apiName})`;
                res.Count = count;
                return res;
            case 'IsEqual':
                if (this.filterValues.length == 1) {
                    // ==
                    filterNames = '';
                    markName = this.AddFilterNameToDynamoResultObject(res, letterForMark, count, this.apiName);
                    markValue = this.AddFilterValueToDynamoResultObject(
                        res,
                        letterForMark,
                        count,
                        this.filterValues[0],
                    );
                    res.ResString = `${markName} = ${markValue}`;
                    count++;
                    res.Count = count;
                } else {
                    filterNames = ''; //IN
                    for (let i = 0; i < this.filterValues.length; i++) {
                        markValue = this.AddFilterValueToDynamoResultObject(
                            res,
                            letterForMark,
                            count,
                            this.filterValues[i],
                        );
                        count++;
                        filterNames = filterNames + markValue + ',';
                    }
                    filterNames = filterNames.slice(0, -1); // remove last ,
                    markName = this.AddFilterNameToDynamoResultObject(res, letterForMark, count, this.apiName);
                    res.ResString = `${markName} IN (${filterNames})`;
                    count++;
                    res.Count = count;
                }
                return res;
            case 'IsNotEqual':
                if (this.filterValues.length == 1) {
                    // !=
                    filterNames = '';
                    markName = this.AddFilterNameToDynamoResultObject(res, letterForMark, count, this.apiName);
                    markValue = this.AddFilterValueToDynamoResultObject(
                        res,
                        letterForMark,
                        count,
                        this.filterValues[0],
                    );
                    res.ResString = `${markName} <> ${markValue}`;
                    count++;
                    res.Count = count;
                } else {
                    // not in
                    filterNames = '';
                    for (let i = 0; i < this.filterValues.length; i++) {
                        markValue = this.AddFilterValueToDynamoResultObject(
                            res,
                            letterForMark,
                            count,
                            this.filterValues[i],
                        );
                        count++;
                        filterNames = filterNames + markValue + ',';
                    }
                    filterNames = filterNames.slice(0, -1); // remove last ,
                    markName = this.AddFilterNameToDynamoResultObject(res, letterForMark, count, this.apiName);
                    res.ResString = `NOT(${markName} IN (${filterNames}))`;
                    count++;
                    res.Count = count;
                }
                return res;
            case '=':
                markName = this.AddFilterNameToDynamoResultObject(res, letterForMark, count, this.apiName);
                markValue = this.AddFilterValueToDynamoResultObject(res, letterForMark, count, this.filterValues[0]);
                count++;
                res.ResString = `${markName} = ${markValue}`;
                res.Count = count;
                return res;
            case '!=':
                markName = this.AddFilterNameToDynamoResultObject(res, letterForMark, count, this.apiName);
                markValue = this.AddFilterValueToDynamoResultObject(res, letterForMark, count, this.filterValues[0]);
                count++;
                res.ResString = `${markName} <> ${markValue}`;
                res.Count = count;
                return res;
            case '>':
                markName = this.AddFilterNameToDynamoResultObject(res, letterForMark, count, this.apiName);
                markValue = this.AddFilterValueToDynamoResultObject(res, letterForMark, count, this.filterValues[0]);
                count++;
                res.ResString = `${markName} > ${markValue}`;
                res.Count = count;
                return res;
            case '>=':
                markName = this.AddFilterNameToDynamoResultObject(res, letterForMark, count, this.apiName);
                markValue = this.AddFilterValueToDynamoResultObject(res, letterForMark, count, this.filterValues[0]);
                count++;
                res.ResString = `${markName} >= ${markValue}`;
                res.Count = count;
                return res;
            case '<':
                markName = this.AddFilterNameToDynamoResultObject(res, letterForMark, count, this.apiName);
                markValue = this.AddFilterValueToDynamoResultObject(res, letterForMark, count, this.filterValues[0]);
                count++;
                res.ResString = `${markName} < ${markValue}`;
                res.Count = count;
                return res;
            case '<=':
                markName = this.AddFilterNameToDynamoResultObject(res, letterForMark, count, this.apiName);
                markValue = this.AddFilterValueToDynamoResultObject(res, letterForMark, count, this.filterValues[0]);
                count++;
                res.ResString = `${markName} <= ${markValue}`;
                res.Count = count;
                return res;
            case 'Between':
                markName = this.AddFilterNameToDynamoResultObject(res, letterForMark, count, this.apiName);
                const markValue0 = this.AddFilterValueToDynamoResultObject(
                    res,
                    letterForMark,
                    count,
                    this.filterValues[0],
                );
                count++;
                const markValue1 = this.AddFilterValueToDynamoResultObject(
                    res,
                    letterForMark,
                    count,
                    this.filterValues[1],
                );
                count++;
                res.ResString = `${markName} BETWEEN ${markValue0} AND ${markValue1}`;
                res.Count = count;
                return res;
        }
    }
}
