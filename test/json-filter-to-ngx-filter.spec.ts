import 'mocha';
import { expect } from 'chai';
import { IPepSmartFilterData } from '../ngx-filters/json-to-ngx/ngx-types';
import moment from 'moment';
import FilterCollection from '../filters/filter-collection';
import { JSONComplexFilter, JSONFilter, toNGXFilter } from '../index';
describe('JSON Filter To NGX Filters', () => {
    describe('1. Number Filters', () => {
        it('1. should support IsEqual operation ', () => {
            const filter: JSONFilter = {
                FieldType: 'Integer',
                Operation: 'IsEqual',
                Values: ['1'],
                ApiName: 'first',
            };
            const ngxFilter = toNGXFilter(filter);
            const expectedResult: IPepSmartFilterData = {
                fieldId: 'first',
                operator: {
                    componentType: ['number', 'boolean', 'text'],
                    id: 'eq',
                    name: 'EQUAL',
                    short: '=',
                },
                value: { first: '1' },
            };
            return expect(ngxFilter).to.be.eql(expectedResult);
        });
        it('2. should support IsNotEqual operation ', () => {
            const filter: JSONFilter = {
                FieldType: 'Integer',
                ApiName: 'first',
                Operation: 'IsNotEqual',
                Values: ['1'],
            };
            const ngxFilter = toNGXFilter(filter);
            const expectedResult: IPepSmartFilterData = {
                fieldId: 'first',
                operator: {
                    componentType: ['number', 'text'],
                    id: 'neq',
                    name: 'NOT_EQUAL',
                    short: '<>',
                },
                value: { first: '1' },
            };

            return expect(ngxFilter).to.be.eql(expectedResult);
        });
        it('3. should support < operation ', () => {
            const filter: JSONFilter = {
                FieldType: 'Integer',
                ApiName: 'first',
                Operation: '<',
                Values: ['1'],
            };
            const ngxFilter = toNGXFilter(filter);
            const expectedResult = {
                fieldId: 'first',
                operator: {
                    componentType: ['number'],
                    id: 'lt',
                    name: 'LESS_THEN',
                    short: '<',
                },
                value: { first: '1' },
            };
            return expect(ngxFilter).to.be.eql(expectedResult);
        });
        it('4. should support > operation ', () => {
            const filter: JSONFilter = {
                FieldType: 'Integer',
                ApiName: 'first',
                Operation: '>',
                Values: ['1'],
            };
            const ngxFilter = toNGXFilter(filter);
            const expectedResult = {
                fieldId: 'first',
                operator: {
                    componentType: ['number'],
                    id: 'gt',
                    name: 'GREATER_THEN',
                    short: '>',
                },
                value: { first: '1' },
            };
            return expect(ngxFilter).to.be.eql(expectedResult);
        });
        it('5. should support = operation ', () => {
            const filter: JSONFilter = {
                FieldType: 'Integer',
                ApiName: 'first',
                Operation: '=',
                Values: ['1'],
            };
            const ngxFilter = toNGXFilter(filter);
            const expectedResult = {
                fieldId: 'first',
                operator: {
                    componentType: ['number', 'boolean', 'text'],
                    id: 'eq',
                    name: 'EQUAL',
                    short: '=',
                },
                value: { first: '1' },
            };
            return expect(ngxFilter).to.be.eql(expectedResult);
        });
        it('6. should support != operation ', () => {
            const filter: JSONFilter = {
                FieldType: 'Integer',
                ApiName: 'first',
                Operation: '!=',
                Values: ['1'],
            };
            const ngxFilter = toNGXFilter(filter);
            const expectedResult = {
                fieldId: 'first',
                operator: {
                    componentType: ['number', 'text'],
                    id: 'neq',
                    name: 'NOT_EQUAL',
                    short: '<>',
                },
                value: { first: '1' },
            };
            return expect(ngxFilter).to.be.eql(expectedResult);
        });
        it('7. should support Between operation ', () => {
            const filter: JSONFilter = {
                FieldType: 'Integer',
                ApiName: 'first',
                Operation: 'Between',
                Values: ['1', '2'],
            };
            const ngxFilter = toNGXFilter(filter);
            const expectedResult = {
                fieldId: 'first',
                operator: {
                    componentType: ['number'],
                    id: 'numberRange',
                    name: 'NUMBER_RANGE',
                    short: 'Range',
                },
                value: { first: '1', second: '2' },
            };
            return expect(ngxFilter).to.be.eql(expectedResult);
        });
    });
    describe('2. String Filters', () => {
        it('1. should support IsEqual operation ', () => {
            const filter: JSONFilter = {
                FieldType: 'String',
                ApiName: 'first',
                Operation: 'IsEqual',
                Values: ['a'],
            };
            const ngxFilter = toNGXFilter(filter);
            const expectedResult: IPepSmartFilterData = {
                fieldId: 'first',
                operator: {
                    componentType: ['number', 'boolean', 'text'],
                    id: 'eq',
                    name: 'EQUAL',
                    short: '=',
                },
                value: { first: 'a' },
            };
            return expect(ngxFilter).to.be.eql(expectedResult);
        });
        it('2. should support IsNotEqual operation ', () => {
            const filter: JSONFilter = {
                FieldType: 'String',
                ApiName: 'first',
                Operation: 'IsNotEqual',
                Values: ['a'],
            };
            const ngxFilter = toNGXFilter(filter);
            const expectedResult: IPepSmartFilterData = {
                fieldId: 'first',
                operator: {
                    componentType: ['number', 'text'],
                    id: 'neq',
                    name: 'NOT_EQUAL',
                    short: '<>',
                },
                value: { first: 'a' },
            };

            return expect(ngxFilter).to.be.eql(expectedResult);
        });
        it('3. should support contains operation ', () => {
            const filter: JSONFilter = {
                FieldType: 'String',
                ApiName: 'first',
                Operation: 'Contains',
                Values: ['a'],
            };
            const ngxFilter = toNGXFilter(filter);
            const expectedResult = {
                fieldId: 'first',
                operator: {
                    componentType: ['text'],
                    id: 'contains',
                    name: 'CONTAINS',
                    short: 'Contains',
                },
                value: { first: 'a' },
            };
            return expect(ngxFilter).to.be.eql(expectedResult);
        });
        it('4. should support StartWith operation ', () => {
            const filter: JSONFilter = {
                FieldType: 'String',
                ApiName: 'first',
                Operation: 'StartWith',
                Values: ['a'],
            };
            const ngxFilter = toNGXFilter(filter);
            const expectedResult = {
                fieldId: 'first',
                operator: {
                    componentType: ['text'],
                    id: 'beginsWith',
                    name: 'BEGINS_WITH',
                    short: 'Begins With',
                },
                value: { first: 'a' },
            };
            return expect(ngxFilter).to.be.eql(expectedResult);
        });
        it('5. should support EndsWith operation ', () => {
            const filter: JSONFilter = {
                FieldType: 'String',
                ApiName: 'first',
                Operation: 'EndWith',
                Values: ['a'],
            };
            const ngxFilter = toNGXFilter(filter);
            const expectedResult = {
                fieldId: 'first',
                operator: {
                    componentType: ['text'],
                    id: 'endsWith',
                    name: 'ENDS_WITH',
                    short: 'Ends With',
                },
                value: { first: 'a' },
            };
            return expect(ngxFilter).to.be.eql(expectedResult);
        });
    });
    describe('3. Date Filters', () => {
        it('1. InTheLast 2 days test ', () => {
            const filter: JSONFilter = {
                FieldType: 'Date',
                ApiName: 'first',
                Operation: 'InTheLast',
                Values: ['2', 'Days'],
            };
            const ngxFilter = toNGXFilter(filter);
            const expectedResult: IPepSmartFilterData = {
                fieldId: 'first',
                operator: {
                    componentType: ['date'],
                    id: 'inTheLast',
                    name: 'IN_THE_LAST',
                    short: 'In the last',
                },
                operatorUnit: {
                    componentType: ['date'],
                    id: 'days',
                    name: 'DAYS',
                },
                value: { first: '2' },
            };
            return expect(ngxFilter).to.be.eql(expectedResult);
        });
        it('2. InTheLast 1 month test ', () => {
            const filter: JSONFilter = {
                FieldType: 'Date',
                ApiName: 'first',
                Operation: 'InTheLast',
                Values: ['1', 'Months'],
            };
            const ngxFilter = toNGXFilter(filter);
            const expectedResult: IPepSmartFilterData = {
                fieldId: 'first',
                operator: {
                    componentType: ['date'],
                    id: 'inTheLast',
                    name: 'IN_THE_LAST',
                    short: 'In the last',
                },
                operatorUnit: {
                    componentType: ['date'],
                    id: 'months',
                    name: 'MONTHS',
                },
                value: { first: '1' },
            };
            return expect(ngxFilter).to.be.eql(expectedResult);
        });
        it('3. InTheLast 3 years test ', () => {
            const filter: JSONFilter = {
                FieldType: 'Date',
                ApiName: 'first',
                Operation: 'InTheLast',
                Values: ['3', 'Years'],
            };
            const ngxFilter = toNGXFilter(filter);
            const expectedResult: IPepSmartFilterData = {
                fieldId: 'first',
                operator: {
                    componentType: ['date'],
                    id: 'inTheLast',
                    name: 'IN_THE_LAST',
                    short: 'In the last',
                },
                operatorUnit: {
                    componentType: ['date'],
                    id: 'years',
                    name: 'YEARS',
                },
                value: { first: '3' },
            };
            return expect(ngxFilter).to.be.eql(expectedResult);
        });
        it('4. should support Between operation ', () => {
            const now = moment();
            const tomorrow = moment().add(1, 'days');
            const filter: JSONFilter = {
                FieldType: 'Date',
                ApiName: 'first',
                Operation: 'Between',
                Values: [now.toString(), tomorrow.toString()],
            };
            const ngxFilter = toNGXFilter(filter);
            const expectedResult: IPepSmartFilterData = {
                fieldId: 'first',
                operator: {
                    componentType: ['date'],
                    id: 'dateRange',
                    name: 'DATE_RANGE',
                    short: 'Range',
                },
                value: { first: now.toString(), second: tomorrow.toString() },
            };

            return expect(ngxFilter).to.be.eql(expectedResult);
        });
        it('5. should support Today operation ', () => {
            const filter: JSONFilter = {
                FieldType: 'Date',
                ApiName: 'first',
                Operation: 'Today',
                Values: [],
            };
            const ngxFilter = toNGXFilter(filter);

            const expectedResult: IPepSmartFilterData = {
                fieldId: 'first',
                operator: {
                    componentType: ['date'],
                    id: 'today',
                    name: 'TODAY',
                    short: 'Today',
                },
                value: { first: null },
            };
            return expect(ngxFilter).to.be.eql(expectedResult);
        });
        it('6. should support ThisWeek operation ', () => {
            const filter: JSONFilter = {
                FieldType: 'Date',
                ApiName: 'first',
                Operation: 'ThisWeek',
                Values: [],
            };
            const ngxFilter = toNGXFilter(filter);
            const expectedResult: IPepSmartFilterData = {
                fieldId: 'first',
                operator: {
                    componentType: ['date'],
                    id: 'thisWeek',
                    name: 'THIS_WEEK',
                    short: 'This week',
                },
                value: { first: null },
            };
            return expect(ngxFilter).to.be.eql(expectedResult);
        });
        it('7. should support ThisMonth operation ', () => {
            const filter: JSONFilter = {
                FieldType: 'Date',
                ApiName: 'first',
                Operation: 'ThisMonth',
                Values: [],
            };
            const ngxFilter = toNGXFilter(filter);
            const expectedResult: IPepSmartFilterData = {
                fieldId: 'first',
                operator: {
                    componentType: ['date'],
                    id: 'thisMonth',
                    name: 'THIS_MONTH',
                    short: 'This month',
                },
                value: { first: null },
            };
            return expect(ngxFilter).to.be.eql(expectedResult);
        });
        it('8. should support IsEmpty operation ', () => {
            const filter: JSONFilter = {
                FieldType: 'Date',
                ApiName: 'first',
                Operation: 'IsEmpty',
                Values: [],
            };
            const ngxFilter = toNGXFilter(filter);
            const expectedResult: IPepSmartFilterData = {
                fieldId: 'first',
                operator: {
                    componentType: ['date'],
                    id: 'isEmpty',
                    name: 'IS_EMPTY',
                    short: 'Is empty',
                },
                value: { first: null },
            };
            return expect(ngxFilter).to.be.eql(expectedResult);
        });
        it('9. should support IsNotEmpty operation ', () => {
            const filter: JSONFilter = {
                FieldType: 'Date',
                ApiName: 'first',
                Operation: 'IsNotEmpty',
                Values: [],
            };
            const ngxFilter = toNGXFilter(filter);
            const expectedResult: IPepSmartFilterData = {
                fieldId: 'first',
                operator: {
                    componentType: ['date'],
                    id: 'isNotEmpty',
                    name: 'IS_NOT_EMPTY',
                    short: 'Is not empty',
                },
                value: { first: null },
            };
            return expect(ngxFilter).to.be.eql(expectedResult);
        });
        it('10. should support On operation ', () => {
            const tomorrowString = moment().add(1, 'days').toString();
            const filter: JSONFilter = {
                FieldType: 'Date',
                ApiName: 'first',
                Operation: 'On',
                Values: [tomorrowString],
            };
            const ngxFilter = toNGXFilter(filter);
            const expectedResult: IPepSmartFilterData = {
                fieldId: 'first',
                operator: {
                    componentType: ['date'],
                    id: 'on',
                    name: 'ON',
                    short: 'On',
                },
                value: { first: tomorrowString },
            };
            return expect(ngxFilter).to.be.eql(expectedResult);
        });
        it('11. DueIn 10 days test ', () => {
            const filter: JSONFilter = {
                FieldType: 'Date',
                ApiName: 'first',
                Operation: 'DueIn',
                Values: ['10', 'days'],
            };
            const ngxFilter = toNGXFilter(filter);
            const expectedResult: IPepSmartFilterData = {
                fieldId: 'first',
                operator: {
                    componentType: ['date'],
                    id: 'dueIn',
                    name: 'DUE_IN',
                    short: 'Due In',
                },
                operatorUnit: {
                    componentType: ['date'],
                    id: 'days',
                    name: 'DAYS',
                },
                value: { first: '10' },
            };
            return expect(ngxFilter).to.be.eql(expectedResult);
        });
        it('12. NotDueIn 10 days test ', () => {
            const filter: JSONFilter = {
                FieldType: 'Date',
                ApiName: 'first',
                Operation: 'NotDueIn',
                Values: ['10', 'days'],
            };
            const ngxFilter = toNGXFilter(filter);
            const expectedResult: IPepSmartFilterData = {
                fieldId: 'first',
                operator: {
                    componentType: ['date'],
                    id: 'notDueIn',
                    name: 'NOT_DUE_IN',
                    short: 'Not Due In',
                },
                operatorUnit: {
                    componentType: ['date'],
                    id: 'days',
                    name: 'DAYS',
                },
                value: { first: '10' },
            };
            return expect(ngxFilter).to.be.eql(expectedResult);
        });
        describe('4. Nested AND Filters', () => {
            it('1. should support IsEqual and IsEqual operation ', () => {
                const firstFilter: JSONFilter = {
                    FieldType: 'String',
                    Operation: 'IsEqual',
                    Values: ['a'],
                    ApiName: 'first',
                };
                const secondFilter: JSONFilter = {
                    FieldType: 'String',
                    Operation: 'IsEqual',
                    Values: ['b'],
                    ApiName: 'second',
                };
                const andFilter: JSONComplexFilter = {
                    Operation: 'AND',
                    RightNode: secondFilter,
                    LeftNode: firstFilter,
                };
                const ngxFilter = toNGXFilter(andFilter);
                const expectedResult: IPepSmartFilterData[] = [
                    {
                        fieldId: 'first',
                        operator: {
                            componentType: ['number', 'boolean', 'text'],
                            id: 'eq',
                            name: 'EQUAL',
                            short: '=',
                        },
                        value: { first: 'a' },
                    },
                    {
                        fieldId: 'second',
                        operator: {
                            componentType: ['number', 'boolean', 'text'],
                            id: 'eq',
                            name: 'EQUAL',
                            short: '=',
                        },
                        value: { first: 'b' },
                    },
                ];
                return expect(ngxFilter).to.be.eql(expectedResult);
            });
            it('2. empty filter collection test ', () => {
                const andFilter = new FilterCollection(true, []);
                const ngxFilter = andFilter.toNgxFilter();
                const expectedResult: IPepSmartFilterData[] = [];
                return expect(ngxFilter).to.be.eql(expectedResult);
            });
            it('3. nested AND test  ', () => {
                const firstFilter: JSONFilter = {
                    FieldType: 'String',
                    Operation: 'IsEqual',
                    Values: ['a'],
                    ApiName: 'first',
                };
                const secondFilter: JSONFilter = {
                    FieldType: 'String',
                    Operation: 'IsEqual',
                    Values: ['b'],
                    ApiName: 'second',
                };
                const andFilter: JSONComplexFilter = {
                    Operation: 'AND',
                    RightNode: secondFilter,
                    LeftNode: firstFilter,
                };
                const thirdFilter: JSONFilter = {
                    ApiName: 'third',
                    Operation: 'IsEqual',
                    FieldType: 'String',
                    Values: ['c'],
                };
                const nestedFilter: JSONComplexFilter = {
                    Operation: 'AND',
                    LeftNode: andFilter,
                    RightNode: thirdFilter,
                };
                const ngxFilter = toNGXFilter(nestedFilter);
                const expectedResult: IPepSmartFilterData[] = [
                    {
                        fieldId: 'first',
                        operator: {
                            componentType: ['number', 'boolean', 'text'],
                            id: 'eq',
                            name: 'EQUAL',
                            short: '=',
                        },
                        value: { first: 'a' },
                    },
                    {
                        fieldId: 'second',
                        operator: {
                            componentType: ['number', 'boolean', 'text'],
                            id: 'eq',
                            name: 'EQUAL',
                            short: '=',
                        },
                        value: { first: 'b' },
                    },
                    {
                        fieldId: 'third',
                        operator: {
                            componentType: ['number', 'boolean', 'text'],
                            id: 'eq',
                            name: 'EQUAL',
                            short: '=',
                        },
                        value: { first: 'c' },
                    },
                ];
                return expect(ngxFilter).to.be.eql(expectedResult);
            });
        });
        describe('5. Guid Filters', () => {
            it('1. should support IsEqual operation ', () => {
                const filter: JSONFilter = {
                    FieldType: 'Guid',
                    ApiName: 'first',
                    Operation: 'IsEqual',
                    Values: ['a'],
                };
                const ngxFilter = toNGXFilter(filter);
                const expectedResult: IPepSmartFilterData = {
                    fieldId: 'first',
                    operator: {
                        componentType: ['number', 'boolean', 'text'],
                        id: 'eq',
                        name: 'EQUAL',
                        short: '=',
                    },
                    value: { first: 'a' },
                };
                return expect(ngxFilter).to.be.eql(expectedResult);
            });
            it('2. should support IsNotEqual operation ', () => {
                const filter: JSONFilter = {
                    FieldType: 'Guid',
                    ApiName: 'first',
                    Operation: 'IsNotEqual',
                    Values: ['a'],
                };
                const ngxFilter = toNGXFilter(filter);
                const expectedResult: IPepSmartFilterData = {
                    fieldId: 'first',
                    operator: {
                        componentType: ['number', 'text'],
                        id: 'neq',
                        name: 'NOT_EQUAL',
                        short: '<>',
                    },
                    value: { first: 'a' },
                };
                return expect(ngxFilter).to.be.eql(expectedResult);
            });
        });
    });
});
