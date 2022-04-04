import 'mocha';
import { expect } from 'chai';
import { toDynamoDBQuery, JSONFilter } from '../index';
import { DynamoResultObject } from '../filters/DynamoObjectResult';

interface Test {
    title: string;
    filter: JSONFilter;
    dynamoResultObject: DynamoResultObject;
}

describe('Dynamo: One level - Integer', () => {
    const fieldName = 'TSAInt';
    const fieldType = 'Integer';
    const values = ['123', '2333'];
    const value = '123';
    const tests: Test[] = [
        {
            title: 'Equals',
            dynamoResultObject: {
                Count: 2,
                ExpressionAttributeNames: { '#a1': fieldName },
                ExpressionAttributeValues: { ':a1': Number(value) },
                ResString: '#a1 = :a1',
            },
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsEqual',
                Values: [value],
            },
        },
        {
            title: 'Not Equal (!=)',
            dynamoResultObject: {
                Count: 2,
                ExpressionAttributeNames: { '#a1': fieldName },
                ExpressionAttributeValues: { ':a1': Number(value) },
                ResString: '#a1 <> :a1',
            },
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsNotEqual',
                Values: [value],
            },
        },
        {
            title: 'In',
            dynamoResultObject: {
                Count: 4,
                ExpressionAttributeNames: { '#a3': fieldName },
                ExpressionAttributeValues: { ':a1': Number(values[0]), ':a2': Number(values[1]) },
                ResString: '#a3 IN (:a1,:a2)',
            },
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsEqual',
                Values: values,
            },
        },
        {
            title: 'Not In',
            dynamoResultObject: {
                Count: 4,
                ExpressionAttributeNames: { '#a3': fieldName },
                ExpressionAttributeValues: { ':a1': Number(values[0]), ':a2': Number(values[1]) },
                ResString: 'NOT(#a3 IN (:a1,:a2))',
            },
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsNotEqual',
                Values: values,
            },
        },
        {
            title: 'BiggerThanOrEquals',
            dynamoResultObject: {
                Count: 2,
                ExpressionAttributeNames: { '#a1': fieldName },
                ExpressionAttributeValues: { ':a1': Number(value) },
                ResString: '#a1 >= :a1',
            },
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '>=',
                Values: [value],
            },
        },
        {
            title: 'BiggerThan',
            dynamoResultObject: {
                Count: 2,
                ExpressionAttributeNames: { '#a1': fieldName },
                ExpressionAttributeValues: { ':a1': Number(value) },
                ResString: '#a1 > :a1',
            },
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '>',
                Values: [value],
            },
        },
        {
            title: 'SmallerThanOrEquals',
            dynamoResultObject: {
                Count: 2,
                ExpressionAttributeNames: { '#a1': fieldName },
                ExpressionAttributeValues: { ':a1': Number(value) },
                ResString: '#a1 <= :a1',
            },
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '<=',
                Values: [value],
            },
        },
        {
            title: 'SmallerThan',
            dynamoResultObject: {
                Count: 2,
                ExpressionAttributeNames: { '#a1': fieldName },
                ExpressionAttributeValues: { ':a1': Number(value) },
                ResString: '#a1 < :a1',
            },
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '<',
                Values: [value],
            },
        },
        {
            title: 'Between',
            dynamoResultObject: {
                Count: 3,
                ExpressionAttributeNames: { '#a1': fieldName },
                ExpressionAttributeValues: { ':a1': Number(values[0]), ':a2': Number(values[1]) },
                ResString: '#a1 BETWEEN :a1 AND :a2',
            },
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'Between',
                Values: values,
            },
        },
        {
            title: 'IS Empty',
            dynamoResultObject: {
                Count: 1,
                ExpressionAttributeNames: {},
                ExpressionAttributeValues: {},
                ResString: `attribute_not_exists (${fieldName})`,
            },
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsEmpty',
                Values: [],
            },
        },
        {
            title: 'IS NOT Empty',
            dynamoResultObject: {
                Count: 1,
                ExpressionAttributeNames: {},
                ExpressionAttributeValues: {},
                ResString: `attribute_exists (${fieldName})`,
            },
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsNotEmpty',
                Values: [],
            },
        },
    ];

    tests.forEach((test) => {
        it(test.title.padStart(20, ' ') + ' | ' + test.dynamoResultObject, () => {
            expect(toDynamoDBQuery(test.filter, 'a', {}, {}, 1)).to.eql(test.dynamoResultObject);
        });
    });
});

describe('Dynamo: One level - boolean', () => {
    const fieldName = 'TSABool';

    const tests: Test[] = [
        {
            title: 'IsEqual',
            dynamoResultObject: {
                Count: 2,
                ExpressionAttributeNames: { '#a1': fieldName },
                ExpressionAttributeValues: { ':a1': true },
                ResString: '#a1 = :a1',
            },
            filter: {
                ApiName: fieldName,
                FieldType: 'Bool',
                Operation: 'IsEqual',
                Values: ['true'],
            },
        },
        {
            title: 'IsEqual',
            dynamoResultObject: {
                Count: 2,
                ExpressionAttributeNames: { '#a1': fieldName },
                ExpressionAttributeValues: { ':a1': false },
                ResString: '#a1 = :a1',
            },
            filter: {
                ApiName: fieldName,
                FieldType: 'Bool',
                Operation: 'IsEqual',
                Values: ['false'],
            },
        },
    ];

    tests.forEach((test) => {
        it(test.title.padStart(20, ' ') + ' | ' + test.dynamoResultObject, () => {
            expect(toDynamoDBQuery(test.filter, 'a', {}, {}, 1)).to.eql(test.dynamoResultObject);
        });
    });
});

describe('Dynamo: One level - String', () => {
    const fieldName = 'TSAString';
    const fieldType = 'String';
    const values = ['Hi', 'Bye'];
    const value = 'Hi';

    const tests: Test[] = [
        {
            title: 'Equals',
            dynamoResultObject: {
                Count: 2,
                ExpressionAttributeNames: { '#a1': fieldName },
                ExpressionAttributeValues: { ':a1': value },
                ResString: '#a1 = :a1',
            },
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsEqual',
                Values: [value],
            },
        },
        {
            title: 'Not Equal (!=)',
            dynamoResultObject: {
                Count: 2,
                ExpressionAttributeNames: { '#a1': fieldName },
                ExpressionAttributeValues: { ':a1': value },
                ResString: '#a1 <> :a1',
            },
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsNotEqual',
                Values: [value],
            },
        },
        {
            title: 'In',
            dynamoResultObject: {
                Count: 4,
                ExpressionAttributeNames: { '#a3': fieldName },
                ExpressionAttributeValues: { ':a1': values[0], ':a2': values[1] },
                ResString: '#a3 IN (:a1,:a2)',
            },
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsEqual',
                Values: values,
            },
        },
        {
            title: 'Not In',
            dynamoResultObject: {
                Count: 4,
                ExpressionAttributeNames: { '#a3': fieldName },
                ExpressionAttributeValues: { ':a1': values[0], ':a2': values[1] },
                ResString: 'NOT(#a3 IN (:a1,:a2))',
            },
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsNotEqual',
                Values: values,
            },
        },
        {
            title: 'IS Empty',
            dynamoResultObject: {
                Count: 2,
                ExpressionAttributeNames: { '#a1': fieldName },
                ExpressionAttributeValues: { ':a1': '' },
                ResString: `attribute_not_exists (#a1) OR #a1 = :a1`,
            },
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsEmpty',
                Values: [],
            },
        },
        {
            title: 'IS NOT Empty',
            dynamoResultObject: {
                Count: 2,
                ExpressionAttributeNames: { '#a1': fieldName },
                ExpressionAttributeValues: { ':a1': '' },
                ResString: `attribute_exists (#a1) AND #a1 <> :a1`,
            },
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsNotEmpty',
                Values: [],
            },
        },
        {
            title: 'Contains',
            dynamoResultObject: {
                Count: 2,
                ExpressionAttributeNames: { '#a1': fieldName },
                ExpressionAttributeValues: { ':a1': value },
                ResString: 'contains (#a1, :a1)',
            },
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'Contains',
                Values: [value],
            },
        },
        {
            title: 'StartsWith',
            dynamoResultObject: {
                Count: 2,
                ExpressionAttributeNames: { '#a1': fieldName },
                ExpressionAttributeValues: { ':a1': value },
                ResString: 'begins_with (#a1, :a1)',
            },
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'StartWith',
                Values: [value],
            },
        },
    ];

    tests.forEach((test) => {
        it(test.title.padStart(15, ' ') + ' | ' + test.dynamoResultObject, () => {
            expect(toDynamoDBQuery(test.filter, 'a', {}, {}, 1)).to.eql(test.dynamoResultObject);
        });
    });
});
