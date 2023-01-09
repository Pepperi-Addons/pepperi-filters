import 'mocha';
import { expect } from 'chai';
import { JSONFilter, toApiQueryString } from '../index';
import moment from 'moment';
import { DateFilter } from '../filters/date-filter';

interface Test {
    title: string;
    filter: JSONFilter;
    where: string;
}

describe('One level - Guid', () => {
    const uuid1 = '6de02514-30f5-45c5-a55e-c2d9cea039b6';

    const tests: Test[] = [
        {
            title: 'Equals',
            where: `UUID = '${uuid1}'`,
            filter: {
                ApiName: 'UUID',
                FieldType: 'Guid',
                Operation: 'IsEqual',
                Values: [uuid1],
            },
        },
        {
            title: 'Not Equal (!=)',
            where: `UUID != '${uuid1}'`,
            filter: {
                ApiName: 'UUID',
                FieldType: 'Guid',
                Operation: 'IsNotEqual',
                Values: [uuid1],
            },
        },
        {
            title: 'IS NULL',
            where: "UUID IS NULL OR UUID = '00000000-0000-0000-0000-000000000000'",
            filter: {
                ApiName: 'UUID',
                FieldType: 'Guid',
                Operation: 'IsEmpty',
                Values: [],
            },
        },
        {
            title: 'IS NOT NULL',
            where: "UUID IS NOT NULL AND UUID != '00000000-0000-0000-0000-000000000000'",
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
            expect(toApiQueryString(test.filter)).to.be.equal(test.where);
        });
    });
});

describe('One level - Integer', () => {
    const fieldName = 'TSAInt';
    const fieldType = 'Integer';

    const tests: Test[] = [
        {
            title: 'IsEqual',
            where: `${fieldName} IN (123, 23)`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsEqual',
                Values: ['123', '23'],
            },
        },
        {
            title: 'Not Equal',
            where: `${fieldName} NOT IN (123, 23)`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsNotEqual',
                Values: ['123', '23'],
            },
        },
        {
            title: 'BiggerThanOrEquals',
            where: `${fieldName} >= ${123}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '>=',
                Values: ['123'],
            },
        },
        {
            title: 'BiggerThan',
            where: `${fieldName} > ${123}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '>',
                Values: ['123'],
            },
        },
        {
            title: 'SmallerThanOrEquals',
            where: `${fieldName} <= ${123}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '<=',
                Values: ['123'],
            },
        },
        {
            title: 'SmallerThan',
            where: `${fieldName} < ${123}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '<',
                Values: ['123'],
            },
        },
        {
            title: 'Between',
            where: `${fieldName} >= ${123} AND ${fieldName} <= ${456}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'Between',
                Values: ['123', '456'],
            },
        },
        {
            title: 'IS NULL',
            where: `${fieldName} IS NULL`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsEmpty',
                Values: [],
            },
        },
        {
            title: 'IS NOT NULL',
            where: `${fieldName} IS NOT NULL`,
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
            expect(toApiQueryString(test.filter)).to.be.equal(test.where);
        });
    });
});

describe('One level - Double', () => {
    const fieldName = 'TSADouble';
    const fieldType = 'Double';

    const tests: Test[] = [
        {
            title: 'Equals',
            where: `${fieldName} IN (123.5, 23.1)`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsEqual',
                Values: ['123.5', '23.1'],
            },
        },
        {
            title: 'Not Equal',
            where: `${fieldName} NOT IN (123.5, 23.1)`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsNotEqual',
                Values: ['123.5', '23.1'],
            },
        },
        {
            title: 'BiggerThanOrEquals',
            where: `${fieldName} >= ${123.5}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '>=',
                Values: ['123.5'],
            },
        },
        {
            title: 'BiggerThan',
            where: `${fieldName} > ${123.5}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '>',
                Values: ['123.5'],
            },
        },
        {
            title: 'SmallerThanOrEquals',
            where: `${fieldName} <= ${123.5}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '<=',
                Values: ['123.5'],
            },
        },
        {
            title: 'SmallerThan',
            where: `${fieldName} < ${123.5}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '<',
                Values: ['123.5'],
            },
        },
        {
            title: 'IS NULL',
            where: `${fieldName} IS NULL`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsEmpty',
                Values: [],
            },
        },
        {
            title: 'IS NOT NULL',
            where: `${fieldName} IS NOT NULL`,
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
            expect(toApiQueryString(test.filter)).to.be.equal(test.where);
        });
    });
});

describe('One level - String', () => {
    const fieldName = 'TSAString';
    const fieldType = 'String';

    const tests: Test[] = [
        {
            title: 'Equals',
            where: `${fieldName} IN ('Hi', 'Bye')`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsEqual',
                Values: ['Hi', 'Bye'],
            },
        },
        {
            title: 'Not Equal',
            where: `${fieldName} NOT IN ('Hi', 'Bye')`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsNotEqual',
                Values: ['Hi', 'Bye'],
            },
        },
        {
            title: 'Contains',
            where: `${fieldName} LIKE '%Hi%'`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'Contains',
                Values: ['Hi'],
            },
        },
        {
            title: 'StartsWith',
            where: `${fieldName} LIKE 'Hi%'`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'StartWith',
                Values: ['Hi'],
            },
        },
        {
            title: 'EndsWith',
            where: `${fieldName} LIKE '%Hi'`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'EndWith',
                Values: ['Hi'],
            },
        },
        {
            title: 'IS NOT NULL',
            where: `${fieldName} IS NOT NULL AND ${fieldName} != ''`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsNotEmpty',
                Values: [],
            },
        },
        {
            title: 'IS NULL',
            where: `${fieldName} IS NULL OR ${fieldName} = ''`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsEmpty',
                Values: [],
            },
        },
    ];

    tests.forEach((test) => {
        it(test.title.padStart(15, ' ') + ' | ' + test.where, () => {
            expect(toApiQueryString(test.filter)).to.be.equal(test.where);
        });
    });
});

describe('One level - DateTime', () => {
    const fieldName = 'TSADateTime';
    const fieldType = 'DateTime';
    const now = new Date().toISOString().split('.')[0] + 'Z';

    const tests: Test[] = [
        {
            title: '=',
            where: `${fieldName} = '${now}'`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '=',
                Values: [now],
            },
        },
        {
            title: '>',
            where: `${fieldName} > '${now}'`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '>',
                Values: [now],
            },
        },
        {
            title: '>=',
            where: `${fieldName} >= '${now}'`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '>=',
                Values: [now],
            },
        },
        {
            title: '<=',
            where: `${fieldName} <= '${now}'`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '<=',
                Values: [now],
            },
        },
        {
            title: '<',
            where: `${fieldName} < '${now}'`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '<',
                Values: [now],
            },
        },
        {
            title: 'IS NOT NULL',
            where: `${fieldName} IS NOT NULL`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsNotEmpty',
                Values: [],
            },
        },
        {
            title: 'IS NULL',
            where: `${fieldName} IS NULL`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsEmpty',
                Values: [],
            },
        },
        {
            title: 'today',
            where: `${fieldName} >= '${DateFilter.momentToApiDateValue(
                moment().startOf('day'),
            )}' AND ${fieldName} <= '${DateFilter.momentToApiDateValue(moment().endOf('day'))}'`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'Today',
                Values: [],
            },
        },
        {
            title: 'This week',
            where: `${fieldName} >= '${DateFilter.momentToApiDateValue(
                moment().startOf('week'),
            )}' AND ${fieldName} <= '${DateFilter.momentToApiDateValue(moment().endOf('week'))}'`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'ThisWeek',
                Values: [],
            },
        },
        {
            title: 'This month',
            where: `${fieldName} >= '${DateFilter.momentToApiDateValue(
                moment().startOf('month'),
            )}' AND ${fieldName} <= '${DateFilter.momentToApiDateValue(moment().endOf('month'))}'`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'ThisMonth',
                Values: [],
            },
        },
        {
            title: 'On - yesterday',
            where: `${fieldName} >= '${DateFilter.momentToApiDateValue(
                moment().subtract(1, 'day').startOf('day'),
            )}' AND ${fieldName} <= '${DateFilter.momentToApiDateValue(moment().subtract(1, 'day').endOf('day'))}'`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'On',
                Values: [moment().subtract(1, 'day').toISOString()],
            },
        },
        {
            title: 'Before - yesterday',
            where: `${fieldName} < '${DateFilter.momentToApiDateValue(moment().subtract(1, 'day'))}'`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'Before',
                Values: [moment().subtract(1, 'day').toISOString()],
            },
        },
        {
            title: 'After - yesterday',
            where: `${fieldName} > '${DateFilter.momentToApiDateValue(moment().subtract(1, 'day'))}'`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'After',
                Values: [moment().subtract(1, 'day').toISOString()],
            },
        },
        {
            title: 'Between',
            where: `${fieldName} >= '${DateFilter.momentToApiDateValue(
                moment().add(1, 'day'),
            )}' AND ${fieldName} <= '${DateFilter.momentToApiDateValue(moment().add(3, 'day'))}'`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'Between',
                Values: [moment().add(1, 'day').toISOString(), moment().add(3, 'day').toISOString()],
            },
        },
        {
            title: 'In the last 2 days',
            where: `${fieldName} >= '${DateFilter.momentToApiDateValue(
                moment().subtract(2, 'day'),
            )}' AND ${fieldName} <= '${DateFilter.momentToApiDateValue(moment())}'`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'InTheLast',
                Values: ['2', 'Days'],
            },
        },
        {
            title: 'In the last 2 weeks',
            where: `${fieldName} >= '${DateFilter.momentToApiDateValue(
                moment().subtract(2, 'week'),
            )}' AND ${fieldName} <= '${DateFilter.momentToApiDateValue(moment())}'`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'InTheLast',
                Values: ['2', 'Weeks'],
            },
        },
        {
            title: 'Not in the last 2 months',
            where: `${fieldName} < '${DateFilter.momentToApiDateValue(moment().subtract(2, 'month'))}'`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'NotInTheLast',
                Values: ['2', 'Months'],
            },
        },
        {
            title: 'Due in the next 2 days',
            where: `${fieldName} >= '${DateFilter.momentToApiDateValue(
                moment(),
            )}' AND ${fieldName} <= '${DateFilter.momentToApiDateValue(moment().add(2, 'day'))}'`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'DueIn',
                Values: ['2', 'Days'],
            },
        },
        {
            title: 'Not due in the next 3 years',
            where: `${fieldName} < '${DateFilter.momentToApiDateValue(
                moment(),
            )}' OR ${fieldName} > '${DateFilter.momentToApiDateValue(moment().add(3, 'year'))}'`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'NotDueIn',
                Values: ['3', 'Years'],
            },
        },
    ];

    tests.forEach((test) => {
        it(test.title.padStart(15, ' ') + ' | ' + test.where, () => {
            expect(toApiQueryString(test.filter)).to.eql(test.where);
        });
    });
});

describe('Two Levels', () => {
    const tests: Test[] = [
        {
            title: 'AND',
            where: `(TSAString LIKE '%HI%') AND (TSADouble >= 123.23)`,
            filter: {
                Operation: 'AND',
                LeftNode: {
                    FieldType: 'String',
                    Operation: 'Contains',
                    ApiName: 'TSAString',
                    Values: ['HI'],
                },
                RightNode: {
                    FieldType: 'Double',
                    Operation: '>=',
                    ApiName: 'TSADouble',
                    Values: ['123.23'],
                },
            },
        },
        {
            title: 'OR',
            where: `(TSAString LIKE '%HI%') OR (TSADouble >= 123.23)`,
            filter: {
                Operation: 'OR',
                LeftNode: {
                    FieldType: 'String',
                    Operation: 'Contains',
                    ApiName: 'TSAString',
                    Values: ['HI'],
                },
                RightNode: {
                    FieldType: 'Double',
                    Operation: '>=',
                    ApiName: 'TSADouble',
                    Values: ['123.23'],
                },
            },
        },
    ];

    tests.forEach((test) => {
        it(test.title.padStart(15, ' ') + ' | ' + test.where, () => {
            expect(toApiQueryString(test.filter)).to.eql(test.where);
        });
    });
});
