import Filter from './filter';
import { StringOperation } from '../json-filter';
import esb, { Query, wildcardQuery } from 'elastic-builder';
import { DynamoResultObject } from './DynamoObjectResult';

export class StringFilter extends Filter {
    constructor(
        apiName: string,
        private operation: StringOperation,
        private filterValues: string[],
        private caseSensitive: boolean = true,
    ) {
        super(apiName);
    }

    apply(value: any): boolean {
        // anything that isn't a string is considered to be an empty value
        const stringVal = typeof value === 'string' ? value : '';

        switch (this.operation) {
            case 'IsEmpty':
                return stringVal === '';
            case 'IsNotEmpty':
                return stringVal !== '';
            case 'IsEqual':
            case 'IsEqualVariable':
                return this.compare(stringVal);
            case 'IsNotEqual':
                return !this.compare(stringVal);
            case 'Contains':
                return stringVal.toLocaleLowerCase().includes(this.filterValues[0].toLocaleLowerCase());
            case 'StartWith':
                return stringVal.toLocaleLowerCase().startsWith(this.filterValues[0].toLocaleLowerCase());
            case 'EndWith':
                return stringVal.toLocaleLowerCase().endsWith(this.filterValues[0].toLocaleLowerCase());
            case 'IsLoggedInUser':
                throw new Error("IsLoggedInUser isn't a supported filter");
        }
    }

    toSQLWhereClause(): string {
        switch (this.operation) {
            case 'IsEmpty':
                return `${this.apiName} IS NULL OR ${this.apiName} = ''`;
            case 'IsNotEmpty':
                return `${this.apiName} IS NOT NULL AND ${this.apiName} != ''`;
            case 'IsEqual':
            case 'IsEqualVariable':
                return `${this.apiName} IN (${this.filterValues.map((str) => `'${str}'`).join(', ')})`;
            case 'IsNotEqual':
                return `${this.apiName} NOT IN (${this.filterValues.map((str) => `'${str}'`).join(', ')})`;
            case 'Contains':
                return `${this.apiName} LIKE '%${this.filterValues[0]}%'`;
            case 'StartWith':
                return `${this.apiName} LIKE '${this.filterValues[0]}%'`;
            case 'EndWith':
                return `${this.apiName} LIKE '%${this.filterValues[0]}'`;
            case 'IsLoggedInUser':
                throw new Error("IsLoggedInUser isn't a supported filter");
        }
    }

    private compare(value: string): boolean {
        if (typeof value !== 'string') {
            return false;
        }

        const first = this.filterValues.find((str) => {
            return (
                str.localeCompare(value, undefined, {
                    sensitivity: this.caseSensitive ? 'case' : 'base',
                }) === 0
            );
        });
        return first != undefined;
    }

    toKibanaFilter(): Query {
        const res = esb.boolQuery();
        const existsFilter = esb.existsQuery(this.apiName);
        const termQueryEmpty = esb.termQuery(`${this.apiName}`, '');
        const termsQueryValues = esb.termsQuery(
            `${this.apiName}`,
            this.filterValues.map((val) => val.toString()),
        );

        switch (this.operation) {
            case 'IsEmpty':
                return res.should([esb.boolQuery().mustNot(existsFilter), esb.boolQuery().must(termQueryEmpty)]);
            case 'IsNotEmpty':
                return res.mustNot(termQueryEmpty).filter(existsFilter);
            case 'IsEqual':
            case 'IsEqualVariable':
                return res.must(termsQueryValues);
            case 'IsNotEqual':
                return res.mustNot(termsQueryValues);
            case 'Contains':
                return wildcardQuery(this.apiName, `*${this.filterValues[0]}*`);
            case 'StartWith':
                return wildcardQuery(this.apiName, `${this.filterValues[0]}*`);
            case 'EndWith':
                return wildcardQuery(this.apiName, `*${this.filterValues[0]}`);
            case 'IsLoggedInUser':
                throw new Error("IsLoggedInUser isn't a supported filter");
        }
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
                markName = this.AddFilterNameToDynamoResultObject(res, letterForMark, count, this.apiName);
                markValue = this.AddFilterValueToDynamoResultObject(res, letterForMark, count, '');
                count++;
                res.ResString = `attribute_not_exists (${markName}) OR ${markName} = ${markValue}`;
                res.Count = count;
                return res;
            case 'IsNotEmpty':
                markName = this.AddFilterNameToDynamoResultObject(res, letterForMark, count, this.apiName);
                markValue = this.AddFilterValueToDynamoResultObject(res, letterForMark, count, '');
                count++;
                res.ResString = `attribute_exists (${markName}) AND ${markName} <> ${markValue}`;
                res.Count = count;
                return res;
            case 'IsEqual':
            case 'IsEqualVariable':
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
                    // in
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
            case 'Contains':
                markName = this.AddFilterNameToDynamoResultObject(res, letterForMark, count, this.apiName);
                markValue = this.AddFilterValueToDynamoResultObject(res, letterForMark, count, this.filterValues[0]);
                count++;
                res.ResString = `contains (${markName}, ${markValue})`;
                res.Count = count;
                return res;
            case 'StartWith':
                markName = this.AddFilterNameToDynamoResultObject(res, letterForMark, count, this.apiName);
                markValue = this.AddFilterValueToDynamoResultObject(res, letterForMark, count, this.filterValues[0]);
                count++;
                res.ResString = `begins_with (${markName}, ${markValue})`;
                res.Count = count;
                return res;
        }
        return res;
    }
}
