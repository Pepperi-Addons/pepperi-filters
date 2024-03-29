import 'mocha';
import { expect } from 'chai';
import { JSONFilter, toKibanaQuery } from '../index';

interface Test {
    title: string;
    filter: JSONFilter;
    kibanaQuery: string;
}

describe('Kibana: One level - Guid', () => {
    const uuid1 = '6de02514-30f5-45c5-a55e-c2d9cea039b6';
    const emptyUUID = '00000000-0000-0000-0000-000000000000';
    const fieldName = 'UUID';
    const fieldType = 'Guid';

    const tests: Test[] = [
        {
            title: 'Equals',
            kibanaQuery: `{"bool":{"must":{"term":{"UUID":"${uuid1}"}}}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsEqual',
                Values: [uuid1],
            },
        },
        {
            title: 'Not Equal (!=)',
            kibanaQuery: `{"bool":{"must_not":{"term":{"${fieldName}":"${uuid1}"}}}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsNotEqual',
                Values: [uuid1],
            },
        },
        {
            title: 'IS NULL',
            kibanaQuery: `{"bool":{"should":[{"bool":{"must_not":{"exists":{"field":"${fieldName}"}}}},{"bool":{"must":{"term":{"${fieldName}":"${emptyUUID}"}}}}]}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsEmpty',
                Values: [],
            },
        },
        {
            title: 'IS NOT NULL',
            kibanaQuery: `{"bool":{"must":{"exists":{"field":"${fieldName}"}},"must_not":{"term":{"${fieldName}":"${emptyUUID}"}}}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsNotEmpty',
                Values: [],
            },
        },
    ];
    tests.forEach((test) => {
        it(test.title.padStart(15, ' ') + ' | ' + test.kibanaQuery, () => {
            expect(JSON.stringify(toKibanaQuery(test.filter))).to.be.equal(test.kibanaQuery);
        });
    });
});

describe('Kibana: One level - Integer', () => {
    const fieldName = 'TSAInt';
    const fieldType = 'Integer';
    const values = ['123', '23'];
    const value = '123';

    const tests: Test[] = [
        {
            title: 'IsEqual',
            kibanaQuery: `{"bool":{"must":{"terms":{"${fieldName}":["${values.join('","')}"]}}}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsEqual',
                Values: values,
            },
        },
        {
            title: 'Not Equal',
            kibanaQuery: `{"bool":{"must_not":{"terms":{"${fieldName}":["${values.join('","')}"]}}}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsNotEqual',
                Values: values,
            },
        },
        {
            title: 'BiggerThanOrEquals',
            kibanaQuery: `{"range":{"${fieldName}":{"gte":${value}}}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '>=',
                Values: [value],
            },
        },
        {
            title: 'BiggerThan',
            kibanaQuery: `{"range":{"${fieldName}":{"gt":${value}}}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '>',
                Values: [value],
            },
        },
        {
            title: 'SmallerThanOrEquals',
            kibanaQuery: `{"range":{"${fieldName}":{"lte":${value}}}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '<=',
                Values: [value],
            },
        },
        {
            title: 'SmallerThan',
            kibanaQuery: `{"range":{"${fieldName}":{"lt":${value}}}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '<',
                Values: [value],
            },
        },
        {
            title: 'IS NULL',
            kibanaQuery: `{"bool":{"must_not":{"exists":{"field":"${fieldName}"}}}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsEmpty',
                Values: [],
            },
        },
        {
            title: 'IS NOT NULL',
            kibanaQuery: `{"bool":{"must":{"exists":{"field":"${fieldName}"}}}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsNotEmpty',
                Values: [],
            },
        },
    ];

    tests.forEach((test) => {
        it(test.title.padStart(20, ' ') + ' | ' + test.kibanaQuery, () => {
            expect(JSON.stringify(toKibanaQuery(test.filter))).to.be.equal(test.kibanaQuery);
        });
    });
});

describe('Kibana: One level - boolean', () => {
    const fieldName = 'TSABool';

    const tests: Test[] = [
        {
            title: 'IsEqual',
            kibanaQuery: `{"term":{"${fieldName}":"true"}}`,
            filter: {
                ApiName: fieldName,
                FieldType: 'Bool',
                Operation: 'IsEqual',
                Values: ['true'],
            },
        },
        {
            title: 'IsEqual',
            kibanaQuery: `{"bool":{"must_not":{"term":{"${fieldName}":"true"}}}}`,
            filter: {
                ApiName: fieldName,
                FieldType: 'Bool',
                Operation: 'IsEqual',
                Values: ['false'],
            },
        },
    ];

    tests.forEach((test) => {
        it(test.title.padStart(20, ' ') + ' | ' + test.kibanaQuery, () => {
            expect(JSON.stringify(toKibanaQuery(test.filter))).to.be.equal(test.kibanaQuery);
        });
    });
});

describe('Kibana: One level - Double', () => {
    const fieldName = 'TSADouble';
    const fieldType = 'Double';
    const values = ['123.5', '23.1'];
    const value = '123.5';

    const tests: Test[] = [
        {
            title: 'Equals',
            kibanaQuery: `{"bool":{"must":{"terms":{"${fieldName}":["${values.join('","')}"]}}}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsEqual',
                Values: values,
            },
        },
        {
            title: 'Not Equal',
            kibanaQuery: `{"bool":{"must_not":{"terms":{"${fieldName}":["${values.join('","')}"]}}}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsNotEqual',
                Values: values,
            },
        },
        {
            title: 'BiggerThanOrEquals',
            kibanaQuery: `{"range":{"${fieldName}":{"gte":${value}}}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '>=',
                Values: [value],
            },
        },
        {
            title: 'BiggerThan',
            kibanaQuery: `{"range":{"${fieldName}":{"gt":${value}}}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '>',
                Values: [value],
            },
        },
        {
            title: 'SmallerThanOrEquals',
            kibanaQuery: `{"range":{"${fieldName}":{"lte":${value}}}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '<=',
                Values: [value],
            },
        },
        {
            title: 'SmallerThan',
            kibanaQuery: `{"range":{"${fieldName}":{"lt":${value}}}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '<',
                Values: [value],
            },
        },
        {
            title: 'IS NULL',
            kibanaQuery: `{"bool":{"must_not":{"exists":{"field":"${fieldName}"}}}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsEmpty',
                Values: [],
            },
        },
        {
            title: 'IS NOT NULL',
            kibanaQuery: `{"bool":{"must":{"exists":{"field":"${fieldName}"}}}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsNotEmpty',
                Values: [],
            },
        },
    ];

    tests.forEach((test) => {
        it(`${test.title.padStart(20, ' ')} | ${test.kibanaQuery.padEnd(10, ' ')}`, () => {
            expect(JSON.stringify(toKibanaQuery(test.filter))).to.eql(test.kibanaQuery);
        });
    });
});

describe('Kibana: One level - String', () => {
    const fieldName = 'TSAString';
    const fieldType = 'String';
    const values = ['Hi', 'Bye'];
    const value = 'Hi';

    const tests: Test[] = [
        {
            title: 'Equals',
            kibanaQuery: `{"bool":{"must":{"terms":{"${fieldName}":["${values.join('","')}"]}}}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsEqual',
                Values: values,
            },
        },
        {
            title: 'Not Equal',
            kibanaQuery: `{"bool":{"must_not":{"terms":{"${fieldName}":["${values.join('","')}"]}}}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsNotEqual',
                Values: values,
            },
        },
        {
            title: 'Contains',
            kibanaQuery: `{"wildcard":{"${fieldName}":"*${value}*"}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'Contains',
                Values: [value],
            },
        },
        {
            title: 'StartsWith',
            kibanaQuery: `{"wildcard":{"${fieldName}":"${value}*"}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'StartWith',
                Values: [value],
            },
        },
        {
            title: 'EndsWith',
            kibanaQuery: `{"wildcard":{"${fieldName}":"*${value}"}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'EndWith',
                Values: [value],
            },
        },
        {
            title: 'DoesNotContain',
            kibanaQuery: `{"bool":{"must_not":{"wildcard":{"${fieldName}":"*${value}*"}}}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'DoesNotContain',
                Values: [value],
            },
        },
        {
            title: 'DoesNotStartWith',
            kibanaQuery: `{"bool":{"must_not":{"wildcard":{"${fieldName}":"${value}*"}}}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'DoesNotStartWith',
                Values: [value],
            },
        },
        {
            title: 'DoesNotEndWith',
            kibanaQuery: `{"bool":{"must_not":{"wildcard":{"${fieldName}":"*${value}"}}}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'DoesNotEndWith',
                Values: [value],
            },
        },
        {
            title: 'IS NOT NULL',
            kibanaQuery: `{"bool":{"filter":{"exists":{"field":"${fieldName}"}},"must_not":{"term":{"${fieldName}":""}}}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsNotEmpty',
                Values: [],
            },
        },
        {
            title: 'IS NULL',
            kibanaQuery: `{"bool":{"should":[{"bool":{"must_not":{"exists":{"field":"${fieldName}"}}}},{"bool":{"must":{"term":{"${fieldName}":""}}}}]}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsEmpty',
                Values: [],
            },
        },
    ];

    tests.forEach((test) => {
        it(test.title.padStart(15, ' ') + ' | ' + test.kibanaQuery, () => {
            expect(JSON.stringify(toKibanaQuery(test.filter))).to.eql(test.kibanaQuery);
        });
    });
});

describe('Kibana: One level - DateTime', () => {
    const fieldName = 'TSADateTime';
    const fieldType = 'DateTime';
    const now = new Date().toISOString().split('.')[0] + 'Z';

    const tests: Test[] = [
        {
            title: '=',
            kibanaQuery: `{"bool":{"must":{"term":{"${fieldName}":"${now}"}}}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '=',
                Values: [now],
            },
        },
        {
            title: '>',
            kibanaQuery: `{"range":{"${fieldName}":{"gt":"${now}"}}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '>',
                Values: [now],
            },
        },
        {
            title: '>=',
            kibanaQuery: `{"range":{"${fieldName}":{"gte":"${now}"}}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '>=',
                Values: [now],
            },
        },
        {
            title: '<=',
            kibanaQuery: `{"range":{"${fieldName}":{"lte":"${now}"}}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '<=',
                Values: [now],
            },
        },
        {
            title: '<',
            kibanaQuery: `{"range":{"${fieldName}":{"lt":"${now}"}}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '<',
                Values: [now],
            },
        },
        {
            title: 'IS NOT NULL',
            kibanaQuery: `{"bool":{"must":{"exists":{"field":"${fieldName}"}}}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsNotEmpty',
                Values: [],
            },
        },
        {
            title: 'IS NULL',
            kibanaQuery: `{"bool":{"must_not":{"exists":{"field":"${fieldName}"}}}}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsEmpty',
                Values: [],
            },
        },
    ];

    tests.forEach((test) => {
        it(test.title.padStart(15, ' ') + ' | ' + test.kibanaQuery, () => {
            expect(JSON.stringify(toKibanaQuery(test.filter))).to.eql(test.kibanaQuery);
        });
    });
});

describe('Kibana: Two Levels', () => {
    const uuid2 = '2de02514-30f5-45c5-a55e-c2d9cea039b6';
    const fieldName = 'UUID';
    const fieldType = 'Guid';

    const tests: Test[] = [
        {
            title: 'AND',
            kibanaQuery: `{"bool":{"must":[{"bool":{"must":{"term":{"${fieldName}":"${uuid2}"}}}},{"bool":{"must_not":{"term":{"${fieldName}":"${uuid2}"}}}}]}}`,
            filter: {
                Operation: 'AND',
                LeftNode: {
                    ApiName: fieldName,
                    FieldType: fieldType,
                    Operation: 'IsEqual',
                    Values: [uuid2],
                },
                RightNode: {
                    ApiName: fieldName,
                    FieldType: fieldType,
                    Operation: 'IsNotEqual',
                    Values: [uuid2],
                },
            },
        },
        {
            title: 'OR',
            kibanaQuery: `{"bool":{"should":[{"bool":{"must":{"term":{"${fieldName}":"${uuid2}"}}}},{"bool":{"must_not":{"term":{"${fieldName}":"${uuid2}"}}}}]}}`,
            filter: {
                Operation: 'OR',
                LeftNode: {
                    ApiName: fieldName,
                    FieldType: fieldType,
                    Operation: 'IsEqual',
                    Values: [uuid2],
                },
                RightNode: {
                    ApiName: fieldName,
                    FieldType: fieldType,
                    Operation: 'IsNotEqual',
                    Values: [uuid2],
                },
            },
        },
    ];

    tests.forEach((test) => {
        it(test.title.padStart(15, ' ') + ' | ' + test.kibanaQuery, () => {
            expect(JSON.stringify(toKibanaQuery(test.filter))).to.eql(test.kibanaQuery);
        });
    });
});

describe('Kibana: Three Levels', () => {
    const tests: Test[] = [
        {
            title: 'AND',
            kibanaQuery: `{"bool":{"must":[{"bool":{"must":[{"range":{"TSADouble":{"lte":123.23}}},{"range":{"TSADouble":{"gte":123.23}}}]}},{"bool":{"should":[{"range":{"TSADouble":{"gte":123.23}}},{"range":{"TSADouble":{"gte":123.23}}}]}}]}}`,
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
        it(test.title.padStart(15, ' ') + ' | ' + test.kibanaQuery, () => {
            expect(JSON.stringify(toKibanaQuery(test.filter))).to.be.equal(test.kibanaQuery);
        });
    });
});
