import 'mocha';
import { expect } from 'chai';
import { toKQLQuery } from '../index';
import { Test } from '../models/test';

describe('Kibana: One level - Guid', () => {
    const uuid1 = '6de02514-30f5-45c5-a55e-c2d9cea039b6';
    const emptyUUID = '00000000-0000-0000-0000-000000000000';

    const tests: Test[] = [
        {
            title: 'Equals',
            where: `{"bool":{"must":{"term":{"UUID.keyword":"${uuid1}"}}}}`,
            filter: {
                ApiName: 'UUID',
                FieldType: 'Guid',
                Operation: 'IsEqual',
                Values: [uuid1],
            },
        },
        {
            title: 'Not Equal (!=)',
            where: `{"bool":{"must_not":{"term":{"UUID.keyword":"${uuid1}"}}}}`,
            filter: {
                ApiName: 'UUID',
                FieldType: 'Guid',
                Operation: 'IsNotEqual',
                Values: [uuid1],
            },
        },
        {
            title: 'IS NULL',
            where: `{"bool":{"should":[{"bool":{"must_not":{"exists":{"field":"UUID"}}}},{"bool":{"must":{"term":{"UUID.keyword":"${emptyUUID}"}}}}]}}`,
            filter: {
                ApiName: 'UUID',
                FieldType: 'Guid',
                Operation: 'IsEmpty',
                Values: [],
            },
        },
        {
            title: 'IS NOT NULL',
            where: `{"bool":{"filter":{"exists":{"field":"UUID"}},"must_not":{"term":{"UUID.keyword":"${emptyUUID}"}}}}`,
            filter: {
                ApiName: 'UUID',
                FieldType: 'Guid',
                Operation: 'IsNotEmpty',
                Values: [],
            },
        },
    ];
    tests.forEach((test) => {
        it(test.title.padStart(15, ' ') + ' | ' + test.where, () => {
            expect(JSON.stringify(toKQLQuery(test.filter)?.toJSON())).to.be.equal(test.where);
        });
    });
});

describe('Kibana: One level - Integer', () => {
    const fieldName = 'TSAInt';
    const fieldType = 'Integer';

    const tests: Test[] = [
        {
            title: 'IsEqual',
            where: `{"bool":{"must":[{"terms": {"${fieldName}": [123,23]}]}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsEqual',
                Values: ['123', '23'],
            },
        },
        {
            title: 'Not Equal',
            where: `{"bool":{"must_not":[{"terms": {"${fieldName}": [123,23]}]}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsNotEqual',
                Values: ['123', '23'],
            },
        },
        {
            title: 'BiggerThanOrEquals',
            where: `{"range": {"${fieldName}": {"gte": 123}}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '>=',
                Values: ['123'],
            },
        },
        {
            title: 'BiggerThan',
            where: `{"range": {"${fieldName}": {"gt": 123}}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '>',
                Values: ['123'],
            },
        },
        {
            title: 'SmallerThanOrEquals',
            where: `{"range": {"${fieldName}": {"lte": 123}}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '<=',
                Values: ['123'],
            },
        },
        {
            title: 'SmallerThan',
            where: `{"range": {"${fieldName}": {"lt": 123}}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '<',
                Values: ['123'],
            },
        },
        {
            title: 'IS NULL',
            where: `{"bool": {"must_not": {	"exists": {	"field":"${fieldName}"}}}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsEmpty',
                Values: [],
            },
        },
        {
            title: 'IS NOT NULL',
            where: `{"bool": {"must":{"exists":{"field":"${fieldName}"}}}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsNotEmpty',
                Values: [],
            },
        },
    ];

    tests.forEach((test) => {
        it(test.title.padStart(20, ' ') + ' | ' + test.where, () => {
            expect(JSON.stringify(toKQLQuery(test.filter)?.toJSON())).to.be.equal(test.where);
        });
    });
});

describe('One level - Double', () => {
    const fieldName = 'TSADouble';
    const fieldType = 'Double';
    const test2Values = ['123.5', '23.1'];
    const testValue = ['123.5'];

    const tests: Test[] = [
        {
            title: 'Equals',
            where: `{"bool":{"must":[{"terms": {"${fieldName}": [${test2Values.join(',')}]}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsEqual',
                Values: test2Values,
            },
        },
        {
            title: 'Not Equal',
            where: `{"bool":{"must_not":[{"terms": {"${fieldName}": [${test2Values.join(',')}]}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsNotEqual',
                Values: test2Values,
            },
        },
        {
            title: 'BiggerThanOrEquals',
            where: `{"range": {"${fieldName}": {"gte": 123.5}}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '>=',
                Values: testValue,
            },
        },
        {
            title: 'BiggerThan',
            where: `{"range": {"${fieldName}": {"gt": 123.5}}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '>',
                Values: testValue,
            },
        },
        {
            title: 'SmallerThanOrEquals',
            where: `{"range": {"${fieldName}": {"lte": 123.5}}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '<=',
                Values: testValue,
            },
        },
        {
            title: 'SmallerThan',
            where: `{"range": {"${fieldName}": {"lt": 123.5}}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '<',
                Values: testValue,
            },
        },
        {
            title: 'IS NULL',
            where: `{"bool": {"must_not": {	"exists": {	"field":"${fieldName}"}}}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsEmpty',
                Values: [],
            },
        },
        {
            title: 'IS NOT NULL',
            where: `{"bool":{"must":{"exists":{"field":"${fieldName}"}}}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsNotEmpty',
                Values: [],
            },
        },
    ];

    tests.forEach((test) => {
        it(`${test.title.padStart(20, ' ')} | ${test.where.padEnd(10, ' ')}`, () => {
            expect(JSON.stringify(toKQLQuery(test.filter)?.toJSON())).to.eql(test.where);
        });
    });
});

// describe('One level - String', () => {
//     const fieldName = 'TSAString';
//     const fieldType = 'String';

//     const tests: Test[] = [
//         {
//             title: 'Equals',
//             where: `${fieldName} IN ('Hi', 'Bye')`,
//             filter: {
//                 ApiName: fieldName,
//                 FieldType: fieldType,
//                 Operation: 'IsEqual',
//                 Values: ['Hi', 'Bye'],
//             },
//         },
//         {
//             title: 'Not Equal',
//             where: `${fieldName} NOT IN ('Hi', 'Bye')`,
//             filter: {
//                 ApiName: fieldName,
//                 FieldType: fieldType,
//                 Operation: 'IsNotEqual',
//                 Values: ['Hi', 'Bye'],
//             },
//         },
//         {
//             title: 'Contains',
//             where: `${fieldName} LIKE '%Hi%'`,
//             filter: {
//                 ApiName: fieldName,
//                 FieldType: fieldType,
//                 Operation: 'Contains',
//                 Values: ['Hi'],
//             },
//         },
//         {
//             title: 'StartsWith',
//             where: `${fieldName} LIKE 'Hi%'`,
//             filter: {
//                 ApiName: fieldName,
//                 FieldType: fieldType,
//                 Operation: 'StartWith',
//                 Values: ['Hi'],
//             },
//         },
//         {
//             title: 'EndsWith',
//             where: `${fieldName} LIKE '%Hi'`,
//             filter: {
//                 ApiName: fieldName,
//                 FieldType: fieldType,
//                 Operation: 'EndWith',
//                 Values: ['Hi'],
//             },
//         },
//         {
//             title: 'IS NOT NULL',
//             where: `${fieldName} IS NOT NULL AND ${fieldName} != ''`,
//             filter: {
//                 ApiName: fieldName,
//                 FieldType: fieldType,
//                 Operation: 'IsNotEmpty',
//                 Values: [],
//             },
//         },
//         {
//             title: 'IS NULL',
//             where: `${fieldName} IS NULL OR ${fieldName} = ''`,
//             filter: {
//                 ApiName: fieldName,
//                 FieldType: fieldType,
//                 Operation: 'IsEmpty',
//                 Values: [],
//             },
//         },
//     ];

//     tests.forEach((test) => {
//         it(test.title.padStart(15, ' ') + ' | ' + test.where, () => {
//             expect(toApiQueryString(test.filter)).to.be.equal(test.where);
//         });
//     });
// });

// describe('One level - DateTime', () => {
//     const fieldName = 'TSADateTime';
//     const fieldType = 'DateTime';
//     const now = new Date().toISOString().split('.')[0] + 'Z';

//     const tests: Test[] = [
//         {
//             title: '=',
//             where: `${fieldName} = '${now}'`,
//             filter: {
//                 ApiName: fieldName,
//                 FieldType: fieldType,
//                 Operation: '=',
//                 Values: [now],
//             },
//         },
//         {
//             title: '>',
//             where: `${fieldName} > '${now}'`,
//             filter: {
//                 ApiName: fieldName,
//                 FieldType: fieldType,
//                 Operation: '>',
//                 Values: [now],
//             },
//         },
//         {
//             title: '>=',
//             where: `${fieldName} >= '${now}'`,
//             filter: {
//                 ApiName: fieldName,
//                 FieldType: fieldType,
//                 Operation: '>=',
//                 Values: [now],
//             },
//         },
//         {
//             title: '<=',
//             where: `${fieldName} <= '${now}'`,
//             filter: {
//                 ApiName: fieldName,
//                 FieldType: fieldType,
//                 Operation: '<=',
//                 Values: [now],
//             },
//         },
//         {
//             title: '<',
//             where: `${fieldName} < '${now}'`,
//             filter: {
//                 ApiName: fieldName,
//                 FieldType: fieldType,
//                 Operation: '<',
//                 Values: [now],
//             },
//         },
//         {
//             title: 'IS NOT NULL',
//             where: `${fieldName} IS NOT NULL`,
//             filter: {
//                 ApiName: fieldName,
//                 FieldType: fieldType,
//                 Operation: 'IsNotEmpty',
//                 Values: [],
//             },
//         },
//         {
//             title: 'IS NOT NULL',
//             where: `${fieldName} IS NULL`,
//             filter: {
//                 ApiName: fieldName,
//                 FieldType: fieldType,
//                 Operation: 'IsEmpty',
//                 Values: [],
//             },
//         },
//     ];

//     tests.forEach((test) => {
//         it(test.title.padStart(15, ' ') + ' | ' + test.where, () => {
//             expect(toApiQueryString(test.filter)).to.eql(test.where);
//         });
//     });
// });

describe('Kibana: Two Levels', () => {
    const uuid2 = '2de02514-30f5-45c5-a55e-c2d9cea039b6';

    const tests: Test[] = [
        {
            title: 'AND',
            where: `{"bool":{"must":[{"bool":{"must":{"term":{"UUID.keyword":"${uuid2}"}}}},{"bool":{"must_not":{"term":{"UUID.keyword":"${uuid2}"}}}}]}}`,
            filter: {
                Operation: 'AND',
                LeftNode: {
                    ApiName: 'UUID',
                    FieldType: 'Guid',
                    Operation: 'IsEqual',
                    Values: [uuid2],
                },
                RightNode: {
                    ApiName: 'UUID',
                    FieldType: 'Guid',
                    Operation: 'IsNotEqual',
                    Values: [uuid2],
                },
            },
        },
        {
            title: 'OR',
            where: `{"bool":{"should":[{"bool":{"must":{"term":{"UUID.keyword":"${uuid2}"}}}},{"bool":{"must_not":{"term":{"UUID.keyword":"${uuid2}"}}}}]}}`,
            filter: {
                Operation: 'OR',
                LeftNode: {
                    ApiName: 'UUID',
                    FieldType: 'Guid',
                    Operation: 'IsEqual',
                    Values: [uuid2],
                },
                RightNode: {
                    ApiName: 'UUID',
                    FieldType: 'Guid',
                    Operation: 'IsNotEqual',
                    Values: [uuid2],
                },
            },
        },
    ];

    tests.forEach((test) => {
        it(test.title.padStart(15, ' ') + ' | ' + test.where, () => {
            expect(JSON.stringify(toKQLQuery(test.filter)?.toJSON())).to.eql(test.where);
        });
    });
});

describe('Kibana: Three Levels', () => {
    const tests: Test[] = [
        {
            title: 'AND',
            where: `{"bool":{"must":[{"bool":{"must":[{"range":{"TSADouble":{"lte":123.23}}},{"range":{"TSADouble":{"gte":123.23}}}]}},{"bool":{"should":[{"range":{"TSADouble":{"gte":123.23}}},{"range":{"TSADouble":{"gte":123.23}}}]}}]}}`,
            filter: {
                Operation: 'AND',
                LeftNode: {
                    Operation: 'AND',
                    LeftNode: {
                        FieldType: 'Double',
                        Operation: '<=',
                        ApiName: 'TSADouble',
                        Values: ['123.23'],
                    },
                    RightNode: {
                        FieldType: 'Double',
                        Operation: '>=',
                        ApiName: 'TSADouble',
                        Values: ['123.23'],
                    },
                },
                RightNode: {
                    Operation: 'OR',
                    RightNode: {
                        FieldType: 'Double',
                        Operation: '>=',
                        ApiName: 'TSADouble',
                        Values: ['123.23'],
                    },
                    LeftNode: {
                        FieldType: 'Double',
                        Operation: '>=',
                        ApiName: 'TSADouble',
                        Values: ['123.23'],
                    },
                },
            },
        },
    ];

    tests.forEach((test) => {
        it(test.title.padStart(15, ' ') + ' | ' + test.where, () => {
            expect(JSON.stringify(toKQLQuery(test.filter)?.toJSON())).to.be.equal(test.where);
        });
    });
});
