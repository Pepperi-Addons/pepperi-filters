import Filter from './filter';
import { str2Bool } from '../converters';
import esb, { Query } from 'elastic-builder';
import { DynamoResultObject } from './DynamoObjectResult';

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

    toDynamoDBQuery(
        letterForMark: string,
        expressionAttributeNames: any,
        expressionAttributeValues: any,
        count: number,
    ): DynamoResultObject {
        const res = {
            Count: count,
            ExpressionAttributeValues: expressionAttributeValues,
            ExpressionAttributeNames: expressionAttributeNames,
            ResString: '',
        };
        const markName = this.AddFilterNameToDynamoResultObject(res, letterForMark, count, this.apiName);
        const markValue = this.AddFilterValueToDynamoResultObject(res, letterForMark, count, this.filterValue);
        res.Count++;
        res.ResString = `${markName} = ${markValue}`;
        return res;
    }
}
