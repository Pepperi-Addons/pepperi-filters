import 'mocha';
import { expect } from 'chai';
import { toDynamoQuery, JSONFilter } from '../index';
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
            dynamoResultObject: new DynamoResultObject(2, {'#a1':fieldName}, {':a1':Number(value)}, '#a1 = :a1'),
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsEqual',
                Values: [value],
            },
        },
        {
            title: 'Not Equal (!=)',
            dynamoResultObject: new DynamoResultObject(2, {'#a1':fieldName}, {':a1':Number(value)}, '#a1 <> :a1'),
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsNotEqual',
                Values: [value],
            },
        },
        {
            title: 'In',
            dynamoResultObject: new DynamoResultObject(4, {'#a3':fieldName}, {':a1':Number(values[0]), ':a2':Number(values[1])}, '#a3 IN (:a1,:a2)'),
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsEqual',
                Values: values,
            },
        },
        {
            title: 'Not In',
            dynamoResultObject: new DynamoResultObject(4, {'#a3':fieldName}, {':a1':Number(values[0]), ':a2':Number(values[1])}, 'NOT(#a3 IN (:a1,:a2))'),
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsNotEqual',
                Values: values,
            },
        },
        {
            title: 'BiggerThanOrEquals',
            dynamoResultObject: new DynamoResultObject(2, {'#a1':fieldName}, {':a1':Number(value)}, '#a1 >= :a1'),
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '>=',
                Values: [value],
            },
        },
        {
            title: 'BiggerThan',
            dynamoResultObject: new DynamoResultObject(2, {'#a1':fieldName}, {':a1':Number(value)}, '#a1 > :a1'),
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '>',
                Values: [value],
            },
        },
        {
            title: 'SmallerThanOrEquals',
            dynamoResultObject: new DynamoResultObject(2, {'#a1':fieldName}, {':a1':Number(value)}, '#a1 <= :a1'),
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '<=',
                Values: [value],
            },
        },
        {
            title: 'SmallerThan',
            dynamoResultObject: new DynamoResultObject(2, {'#a1':fieldName}, {':a1':Number(value)}, '#a1 < :a1'),
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '<',
                Values: [value],
            },
        },
        {
            title: 'Between',
            dynamoResultObject: new DynamoResultObject(3, {'#a1':fieldName}, {':a1':Number(values[0]), ':a2':Number(values[1])}, '#a1 BETWEEN :a1 AND :a2'),
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'Between',
                Values: values,
            },
        },
        {
            title: 'IS Empty',
            dynamoResultObject: new DynamoResultObject(1, {}, {}, `attribute_not_exists (${fieldName})`),
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsEmpty',
                Values: [],
            },
        },
        {
            title: 'IS NOT Empty',
            dynamoResultObject: new DynamoResultObject(1, {}, {}, `attribute_exists (${fieldName})`),
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
            expect(JSON.stringify(toDynamoQuery(test.filter, 'a', {}, {}, 1))).to.be.equal(JSON.stringify(test.dynamoResultObject));
        });
    });
});

describe('Dynamo: One level - boolean', () => {
    const fieldName = 'TSABool';

    const tests: Test[] = [
        {
            title: 'IsEqual',
            dynamoResultObject: new DynamoResultObject(2, {'#a1':fieldName}, {':a1':true}, '#a1 = :a1'),
            filter: {
                ApiName: fieldName,
                FieldType: 'Bool',
                Operation: 'IsEqual',
                Values: ['true'],
            },
        },
        {
            title: 'IsEqual',
            dynamoResultObject: new DynamoResultObject(2, {'#a1':fieldName}, {':a1':false}, '#a1 = :a1'),
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
            expect(JSON.stringify(toDynamoQuery(test.filter, 'a', {}, {}, 1))).to.be.equal(JSON.stringify(test.dynamoResultObject));
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
            dynamoResultObject: new DynamoResultObject(2, {'#a1':fieldName}, {':a1':value}, '#a1 = :a1'),
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsEqual',
                Values: [value],
            },
        },
        {
            title: 'Not Equal (!=)',
            dynamoResultObject: new DynamoResultObject(2, {'#a1':fieldName}, {':a1':value}, '#a1 <> :a1'),
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsNotEqual',
                Values: [value],
            },
        },
        {
            title: 'In',
            dynamoResultObject: new DynamoResultObject(4, {'#a3':fieldName}, {':a1':values[0], ':a2':values[1]}, '#a3 IN (:a1,:a2)'),
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsEqual',
                Values: values,
            },
        },
        {
            title: 'Not In',
            dynamoResultObject: new DynamoResultObject(4, {'#a3':fieldName}, {':a1':values[0], ':a2':values[1]}, 'NOT(#a3 IN (:a1,:a2))'),
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsNotEqual',
                Values: values,
            },
        },
        {
            title: 'IS Empty',
            dynamoResultObject: new DynamoResultObject(2, {"#a1":fieldName}, {":a1":""}, `attribute_not_exists (#a1) OR #a1 = :a1`),
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsEmpty',
                Values: [],
            },
        },
        {
            title: 'IS NOT Empty',
            dynamoResultObject: new DynamoResultObject(2, {"#a1":fieldName}, {":a1":""}, `attribute_exists (#a1) AND #a1 <> :a1`),
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsNotEmpty',
                Values: [],
            },
        },
        {
            title: 'Contains',
            dynamoResultObject: new DynamoResultObject(2, {'#a1':fieldName}, {':a1':value}, 'contains (#a1, :a1)'),
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'Contains',
                Values: [value],
            },
        },
        {
            title: 'StartsWith',
            dynamoResultObject: new DynamoResultObject(2, {'#a1':fieldName}, {':a1':value}, 'begins_with (#a1, :a1)'),
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
            expect(JSON.stringify(toDynamoQuery(test.filter, 'a', {}, {}, 1))).to.be.equal(JSON.stringify(test.dynamoResultObject));
        });
    });
});

