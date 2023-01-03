import { Query } from 'elastic-builder';
import { IFilterObject } from '../index';
import { DynamoResultObject } from './DynamoObjectResult';

export default abstract class Filter {
    constructor(protected apiName: string) {}

    abstract apply(value: any): boolean;
    abstract toSQLWhereClause(): string;
    abstract toKibanaFilter(): Query;
    abstract toDynamoDBQuery(
        letterForMark: string,
        expressionAttributeNames: any,
        expressionAttributeValues: any,
        count: number,
    ): DynamoResultObject;

    filter(object: any) {
        const value = this.getValue(object, this.apiName);
        return this.apply(value);
    }

    static filter(objects: any[], filter: Filter) {
        return objects.filter((obj) => filter.filter(obj));
    }

    async filterAsync(object: IFilterObject<any>) {
        const value = await object.getValue(this.apiName);
        return this.apply(value);
    }

    static async filterAsync(objects: IFilterObject<any>[], filter: Filter) {
        const results = await Promise.all(objects.map(async (obj) => await filter.filterAsync(obj)));
        return objects.filter((_v, index) => results[index]);
    }

    getValue(object: any, apiName: string): any {
        if (!apiName) {
            return undefined;
        }

        if (typeof object !== 'object') {
            return undefined;
        }

        // support regular APINames & dot anotation
        if (apiName in object) {
            return object[apiName];
        }

        // support nested object & arrays
        apiName = apiName.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        const arr = apiName.split('.');
        return this.getValue(object[arr[0]], arr.slice(1).join('.'));
    }

    AddFilterValueToDynamoResultObject(
        res: DynamoResultObject,
        letterForMark: string,
        count: number,
        value: any,
    ): string {
        const markValue = ':' + letterForMark + count;
        res.ExpressionAttributeValues[markValue] = value;
        return markValue;
    }

    AddFilterNameToDynamoResultObject(
        res: DynamoResultObject,
        letterForMark: string,
        count: number,
        name: any,
    ): string {
        const markName = '#' + letterForMark + count;
        res.ExpressionAttributeNames[markName] = name;
        return markName;
    }
}
