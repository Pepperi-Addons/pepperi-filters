import Filter from './filter';
import { str2Bool } from '../converters';
import esb, { Query } from 'elastic-builder';
import { DynamoResultObject } from './DynamoObjectResult';
import { NGXFilterOnOperation, NGXFilterOperation } from '../ngx-filters/json-to-ngx/ngx-filters-operations';
import { IPepSmartFilterData } from '../ngx-filters/json-to-ngx/ngx-types';
import { JSONBoolFilter } from '../json-filter';
import { NGXNumberFiltersFactory } from '../ngx-filters/ngx-filters-factories/ngx-number-filters-factory';

export class BooleanFilter extends Filter {
    toNgxFilter(): IPepSmartFilterData{

        const filter: JSONBoolFilter = {
            Values: this.filterValue ? ['true']: ['false'],
            ApiName: this.apiName,
            FieldType: 'Bool',
            Operation: 'IsEqual'
        }
        return {
            operator: {
                componentType: ['number', 'boolean', 'text'],
                id: 'eq',
                name: "EQUAL",
                short: "="
            },
            fieldId: this.apiName,
            value: {first: this.filterValue? ['true']: ['false']}
        }
    }
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
