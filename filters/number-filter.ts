import Filter from './filter';
import { NumberOperation } from '../json-filter';
import esb, { Query } from 'elastic-builder';
import { DynamoResultObject } from './DynamoObjectResult';

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

    toDynamoWhereClause(letterForMark: string, expressionAttributeNames: any, expressionAttributeValues: any, count: number): DynamoResultObject {
        var res = new DynamoResultObject(count, expressionAttributeNames, expressionAttributeValues, '');

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
                if(this.filterValues.length == 1){ // ==
                    var filterNames = "";
                    var markValue = ":" + letterForMark + count;
                    var markName = "#" + letterForMark + count;
                    res.ExpressionAttributeNames[markName] = this.apiName
                    res.ExpressionAttributeValues[markValue] = this.filterValues[0]
                    res.ResString = `${markName} = ${markValue}`;
                    count++;
                    res.Count = count;
                }
                else{
                    var filterNames = "";
                    this.filterValues.forEach(function (value) {
                        var markValue = ":" + letterForMark + count;
                        res.ExpressionAttributeValues[markValue] = value
                        count++;
                        filterNames = filterNames + markValue + ",";
                    });
                    filterNames = filterNames.slice(0, -1) // remove last ,
                    var markName = "#" + letterForMark + count;
                    res.ExpressionAttributeNames[markName] = this.apiName
                    res.ResString = `${markName} IN (${filterNames})`;
                    count++;
                    res.Count = count;
                }
                return res;           
            case 'IsNotEqual':
                if(this.filterValues.length == 1){ // !=
                    var filterNames = "";
                    var markValue = ":" + letterForMark + count;
                    var markName = "#" + letterForMark + count;
                    res.ExpressionAttributeNames[markName] = this.apiName
                    res.ExpressionAttributeValues[markValue] = this.filterValues[0]
                    res.ResString = `${markName} <> ${markValue}`;
                    count++;
                    res.Count = count;
                }
                else{ // not in
                    var filterNames = "";
                    this.filterValues.forEach(function (value) {
                        var mark = ":" + letterForMark + count;
                        res.ExpressionAttributeValues[mark] = value
                        count++;
                        filterNames = filterNames + mark + ",";
                    });
                    filterNames = filterNames.slice(0, -1) // remove last ,
                    var markName = "#" + letterForMark + count;
                    res.ExpressionAttributeNames[markName] = this.apiName
                    res.ResString = `NOT(${markName} IN (${filterNames}))`;
                    count++;
                    res.Count = count;
                } 
                return res;           
            case '=':
                var markValue = ":" + letterForMark + count;
                var markName = "#" + letterForMark + count;
                res.ExpressionAttributeNames[markName] = this.apiName
                res.ExpressionAttributeValues[markValue] = this.filterValues[0]
                count++;
                res.ResString = `${markName} = ${markValue}`;
                res.Count = count;
                return res;                
            case '!=':
                var markValue = ":" + letterForMark + count;
                var markName = "#" + letterForMark + count;
                res.ExpressionAttributeNames[markName] = this.apiName
                res.ExpressionAttributeValues[markValue] = this.filterValues[0]
                count++;
                res.ResString = `${markName} <> ${markValue}`;
                res.Count = count;
                return res;                
            case '>':
                var markValue = ":" + letterForMark + count;
                var markName = "#" + letterForMark + count;
                res.ExpressionAttributeNames[markName] = this.apiName
                res.ExpressionAttributeValues[markValue] = this.filterValues[0]
                count++;
                res.ResString =  `${markName} > ${markValue}`;
                res.Count = count;
                return res;
            case '>=':
                var markValue = ":" + letterForMark + count;
                var markName = "#" + letterForMark + count;
                res.ExpressionAttributeNames[markName] = this.apiName
                res.ExpressionAttributeValues[markValue] = this.filterValues[0]
                count++;
                res.ResString = `${markName} >= ${markValue}`;
                res.Count = count;
                return res;
            case '<':
                var markValue = ":" + letterForMark + count;
                var markName = "#" + letterForMark + count;
                res.ExpressionAttributeNames[markName] = this.apiName
                res.ExpressionAttributeValues[markValue] = this.filterValues[0]
                count++;
                res.ResString = `${markName} < ${markValue}`;
                res.Count = count;
                return res;
            case '<=':
                var markValue = ":" + letterForMark + count;
                var markName = "#" + letterForMark + count;
                res.ExpressionAttributeNames[markName] = this.apiName
                res.ExpressionAttributeValues[markValue] = this.filterValues[0]
                count++;
                res.ResString = `${markName} <= ${markValue}`;
                res.Count = count;
                return res;
            case 'Between':
                var markName = "#" + letterForMark + count;
                res.ExpressionAttributeNames[markName] = this.apiName
                var mark0 = ":" + letterForMark + count;
                res.ExpressionAttributeValues[mark0] = this.filterValues[0]
                count++;
                var mark1 = ":" + letterForMark + count;
                res.ExpressionAttributeValues[mark1] = this.filterValues[1]
                count++;
                res.ResString = `${markName} BETWEEN ${mark0} AND ${mark1}`
                res.Count = count;
                return res;
        }       
    }  
}
