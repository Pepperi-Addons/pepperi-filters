import 'mocha';
import { expect } from 'chai';
import { IPepSmartFilterData } from '../ngx-filters/json-to-ngx/ngx-types';
import { NumberFilter } from '../filters/number-filter';
import { StringFilter } from '../filters/string-filter';
import { DateFilter } from '../filters/date-filter';
import moment from 'moment';
import FilterCollection from '../filters/filter-collection';


describe('JSON Filter To NGX Filters', () => {
    describe('1. Number Filters', () => {
        it('1. should support IsEqual operation ', () => {
            const filter = new NumberFilter('first', 'IsEqual', [1])
            const ngxFilter = filter.toNgxFilter()
            const expectedResult: IPepSmartFilterData = {
                fieldId: 'first',
                operator: {
                    componentType: ['number', 'boolean', 'text'],
                    id: 'eq',
                    name: "EQUAL",
                    short: "="
                },
                value: {first: '1'}
            }
            return expect(ngxFilter).to.be.eql(expectedResult)
        })
        it('2. should support IsNotEqual operation ', () => {
            const filter = new NumberFilter('first', 'IsNotEqual', [1])
            const ngxFilter = filter.toNgxFilter()
            const expectedResult: IPepSmartFilterData = {
                fieldId: 'first',
                operator: {
                    componentType: ['number', 'text'],
                    id: 'neq',
                    name: "NOT_EQUAL",
                    short: "<>"
                },
                value: {first: '1'}
            }

            return expect(ngxFilter).to.be.eql(expectedResult)
        })
        it('3. should support < operation ', () => {
            const filter = new NumberFilter('first', '<', [1])
            const ngxFilter = filter.toNgxFilter()
            const expectedResult = {
                fieldId: 'first',
                operator: {
                    componentType: ['number'],
                    id: 'lt',
                    name: "LESS_THEN",
                    short: "<"
                },
                value: {first: '1'}
            }
            return expect(ngxFilter).to.be.eql(expectedResult)
        })
        it('4. should support > operation ', () => {
            const filter = new NumberFilter('first', '>', [1])
            const ngxFilter = filter.toNgxFilter()
            const expectedResult = {
                fieldId: 'first',
                operator: {
                    componentType: ['number'],
                    id: 'gt',
                    name: "GREATER_THEN",
                    short: ">"
                },
                value: {first: '1'}
            }
            return expect(ngxFilter).to.be.eql(expectedResult)
        })
        it('5. should support = operation ', () => {
            const filter = new NumberFilter('first', '=', [1])
            const ngxFilter = filter.toNgxFilter()
            const expectedResult = {
                fieldId: 'first',
                operator: {
                    componentType: ['number', 'boolean', 'text'],
                    id: 'eq',
                    name: "EQUAL",
                    short: "="
                },
                value: {first: '1'}
            }
            return expect(ngxFilter).to.be.eql(expectedResult)
        })
        it('6. should support != operation ', () => {
            const filter = new NumberFilter('first', '!=', [1])
            const ngxFilter = filter.toNgxFilter()
            const expectedResult = {
                fieldId: 'first',
                operator: {
                    componentType: ['number', 'text'],
                    id: 'neq',
                    name: "NOT_EQUAL",
                    short: "<>"
                },
                value: {first: '1'}
            }
            return expect(ngxFilter).to.be.eql(expectedResult)
        }) 
        it('7. should support Between operation ', () => {
            const filter = new NumberFilter('first', 'Between', [1, 2])
            const ngxFilter = filter.toNgxFilter()
            const expectedResult = {
                fieldId: 'first',
                operator: {
                    componentType: ['number'],
                    id: 'numberRange',
                    name: "NUMBER_RANGE",
                    short: "Range"
                },
                value: {first: '1', second: '2'}
            }
            return expect(ngxFilter).to.be.eql(expectedResult)
        })
    });
    describe('2. String Filters', () => {
        it('1. should support IsEqual operation ', () => {
            const filter = new StringFilter('first', 'IsEqual', ['a'])
            const ngxFilter = filter.toNgxFilter()
            const expectedResult: IPepSmartFilterData = {
                fieldId: 'first',
                operator: {
                    componentType: ['number', 'boolean', 'text'],
                    id: 'eq',
                    name: "EQUAL",
                    short: "="
                },
                value: {first: 'a'}
            }
            return expect(ngxFilter).to.be.eql(expectedResult)
        })
        it('2. should support IsNotEqual operation ', () => {
            const filter = new StringFilter('first', 'IsNotEqual', ['a'])
            const ngxFilter = filter.toNgxFilter()
            const expectedResult: IPepSmartFilterData = {
                fieldId: 'first',
                operator: {
                    componentType: ['number', 'text'],
                    id: 'neq',
                    name: "NOT_EQUAL",
                    short: "<>"
                },
                value: {first: 'a'}
            }

            return expect(ngxFilter).to.be.eql(expectedResult)
        })
        it('3. should support contains operation ', () => {
            const filter = new StringFilter('first', 'Contains', ['a'])
            const ngxFilter = filter.toNgxFilter()
            const expectedResult = {
                fieldId: 'first',
                operator: {
                    componentType: ['text'],
                    id: 'contains',
                    name: "CONTAINS",
                    short: "Contains"
                },
                value: {first: 'a'}
            }
            return expect(ngxFilter).to.be.eql(expectedResult)
        })
        it('4. should support StartWith operation ', () => {
            const filter = new StringFilter('first','StartWith', ['a'])
            const ngxFilter = filter.toNgxFilter()
            const expectedResult = {
                fieldId: 'first',
                operator: {
                    componentType: ['text'],
                    id: 'beginsWith',
                    name: "BEGINS_WITH",
                    short: "Begins With"
                },
                value: {first: 'a'}
            }
            return expect(ngxFilter).to.be.eql(expectedResult)
        })
        it('5. should support EndsWith operation ', () => {
            const filter = new StringFilter('first', 'EndWith' , ['a'])
            const ngxFilter = filter.toNgxFilter()
            const expectedResult = {
                fieldId: 'first',
                operator: {
                    componentType: ['text'],
                    id: 'endsWith',
                    name: "ENDS_WITH",
                    short: "Ends With"
                },
                value: {first: 'a'}
            }
            return expect(ngxFilter).to.be.eql(expectedResult)
        })
    });
    describe('3. Date Filters', () => {
        it('1. InTheLast 2 days test ', () => {
            const filter = new DateFilter('first', 'InTheLast', ['2', 'Days'])
            const ngxFilter = filter.toNgxFilter()
            const expectedResult: IPepSmartFilterData = {
                fieldId: 'first',
                operator: {
                    componentType: ['date'],
                    id: 'inTheLast',
                    name: "IN_THE_LAST",
                    short: "In the last"
                },
                operatorUnit: {
                    componentType: ['date'],
                    id: 'days',
                    name: 'DAYS'
                },
                value: {first: '2'}
            }
            return expect(ngxFilter).to.be.eql(expectedResult)
        })
        it('2. InTheLast 1 month test ', () => {
            const filter = new DateFilter('first', 'InTheLast', ['1', 'Months'])
            const ngxFilter = filter.toNgxFilter()
            const expectedResult: IPepSmartFilterData = {
                fieldId: 'first',
                operator: {
                    componentType: ['date'],
                    id: 'inTheLast',
                    name: "IN_THE_LAST",
                    short: "In the last"
                },
                operatorUnit: {
                    componentType: ['date'],
                    id: 'months',
                    name: 'MONTHS'
                },
                value: {first: '1'}
            }
            return expect(ngxFilter).to.be.eql(expectedResult)
        })
        it('3. InTheLast 3 years test ', () => {
            const filter = new DateFilter('first', 'InTheLast', ['3', 'Years'])
            const ngxFilter = filter.toNgxFilter()
            const expectedResult: IPepSmartFilterData = {
                fieldId: 'first',
                operator: {
                    componentType: ['date'],
                    id: 'inTheLast',
                    name: "IN_THE_LAST",
                    short: "In the last"
                },
                operatorUnit: {
                    componentType: ['date'],
                    id: 'years',
                    name: 'YEARS'
                },
                value: {first: '3'}
            }
            return expect(ngxFilter).to.be.eql(expectedResult)
        })
        it('4. should support Between operation ', () => {
            const now = moment()
            const tomorrow = moment().add(1, 'days')
            const filter = new DateFilter('first', 'Between', [now.toString(), tomorrow.toString()])
            const ngxFilter = filter.toNgxFilter()
            const expectedResult: IPepSmartFilterData = {
                fieldId: 'first',
                operator: {
                    componentType: ['date'],
                    id: "dateRange",
                    name: "DATE_RANGE",
                    short: "Range"
                },
                value: {first: now.toString(), second: tomorrow.toString()}
            }

            return expect(ngxFilter).to.be.eql(expectedResult)
        })
        it('5. should support Today operation ', () => {
            const filter = new DateFilter('first', 'Today', [])
            const ngxFilter = filter.toNgxFilter()
            const expectedResult: IPepSmartFilterData = {
                fieldId: 'first',
                operator: {
                    componentType: ['date'],
                    id: "today",
                    name: "TODAY",
                    short: "Today"
                },
                value: {first: null}
            }
            return expect(ngxFilter).to.be.eql(expectedResult)
        })
        it('6. should support ThisWeek operation ', () => {
            const filter = new DateFilter('first', 'ThisWeek', [])
            const ngxFilter = filter.toNgxFilter()
            const expectedResult: IPepSmartFilterData = {
                fieldId: 'first',
                operator: {
                    componentType: ['date'],
                    id: "thisWeek",
                    name: "THIS_WEEK",
                    short: "This week"
                },
                value: {first: null}
            }
            return expect(ngxFilter).to.be.eql(expectedResult)
        })
        it('7. should support ThisMonth operation ', () => {
            const filter = new DateFilter('first', 'ThisMonth', [])
            const ngxFilter = filter.toNgxFilter()
            const expectedResult: IPepSmartFilterData = {
                fieldId: 'first',
                operator: {
                    componentType: ['date'],
                    id: "thisMonth",
                    name: "THIS_MONTH",
                    short: "This month"
                },
                value: {first: null}
            }
            return expect(ngxFilter).to.be.eql(expectedResult)
        })
        it('8. should support IsEmpty operation ', () => {
            const filter = new DateFilter('first', 'IsEmpty' , [])
            const ngxFilter = filter.toNgxFilter()
            const expectedResult: IPepSmartFilterData = {
                fieldId: 'first',
                operator: {
                    componentType: ['date'],
                    id: "isEmpty",
                    name: "IS_EMPTY",
                    short: "Is empty"
                },
                value: {first: null}
            }
            return expect(ngxFilter).to.be.eql(expectedResult)
        })
        it('9. should support IsNotEmpty operation ', () => {
            const filter = new DateFilter('first', 'IsNotEmpty' , [])
            const ngxFilter = filter.toNgxFilter()
            const expectedResult: IPepSmartFilterData = {
                fieldId: 'first',
                operator: {
                    componentType: ['date'],
                    id: "isNotEmpty",
                    name: "IS_NOT_EMPTY",
                    short: "Is not empty"
                },
                value: {first: null}
            }
            return expect(ngxFilter).to.be.eql(expectedResult)
        })
        it('10. should support On operation ', () => {
            const tomorrowString = moment().add(1,'days').toString()
            const filter = new DateFilter('first', 'On' , [tomorrowString])
            const ngxFilter = filter.toNgxFilter()
            const expectedResult: IPepSmartFilterData = {
                fieldId: 'first',
                operator: {
                    componentType: ['date'],
                    id: "on",
                    name: "ON",
                    short: "On"
                },
                value: {first: tomorrowString}
            }
            return expect(ngxFilter).to.be.eql(expectedResult)
        })
        it('11. DueIn 10 days test ', () => {
            const filter = new DateFilter('first', 'DueIn' , ['10', 'days'])
            const ngxFilter = filter.toNgxFilter()
            const expectedResult: IPepSmartFilterData = {
                fieldId: 'first',
                operator: {
                    componentType: ['date'],
                    id: "dueIn",
                    name: "DUE_IN",
                    short: "Due In"
                },
                operatorUnit: {
                    componentType: ['date'],
                    id: 'days',
                    name: 'DAYS'
                },
                value: {first: '10'}
            }
            return expect(ngxFilter).to.be.eql(expectedResult)
        })
        it('12. NotDueIn 10 days test ', () => {
            const filter = new DateFilter('first', 'NotDueIn' , ['10', 'days'])
            const ngxFilter = filter.toNgxFilter()
            const expectedResult: IPepSmartFilterData = {
                fieldId: 'first',
                operator: {
                    componentType: ['date'],
                    id: "notDueIn",
                    name: "NOT_DUE_IN",
                    short: "Not Due In"
                },
                operatorUnit: {
                    componentType: ['date'],
                    id: 'days',
                    name: 'DAYS'
                },
                value: {first: '10'}
            }
            return expect(ngxFilter).to.be.eql(expectedResult)
        })
        describe('4. Nested AND Filters', () => {
            it('1. should support IsEqual and IsEqual operation ', () => {
                const filter = new StringFilter('first', 'IsEqual', ['a'])
                const secondFilter = new StringFilter('second', 'IsEqual', ['b'])
                const andFilter = new FilterCollection(true, [filter , secondFilter])
                const ngxFilter = andFilter.toNgxFilter()
                const expectedResult: IPepSmartFilterData[] = [
                    {
                        fieldId: 'first',
                        operator: {
                            componentType: ['number', 'boolean', 'text'],
                            id: 'eq',
                            name: "EQUAL",
                            short: "="
                        },
                        value: {first: 'a'}
                    },
                    {
                        fieldId: 'second',
                        operator: {
                            componentType: ['number', 'boolean', 'text'],
                            id: 'eq',
                            name: "EQUAL",
                            short: "="
                        },
                        value: {first: 'b'}
                    },
                ]
                return expect(ngxFilter).to.be.eql(expectedResult)
            })
            it('2. empty filter collection test ', () => {
                const andFilter = new FilterCollection(true, [])
                const ngxFilter = andFilter.toNgxFilter()
                const expectedResult: IPepSmartFilterData[] = []
                return expect(ngxFilter).to.be.eql(expectedResult)
            })
            it('3. nested AND test  ', () => {
                const filter = new StringFilter('first', 'IsEqual', ['a'])
                const secondFilter = new StringFilter('second', 'IsEqual', ['b'])
                const andFilter = new FilterCollection(true, [filter , secondFilter])
                const thirdFilter = new StringFilter('third', 'IsEqual', ['c'])
                const nestedFilter = new FilterCollection(true , [andFilter, thirdFilter])
                const ngxFilter = nestedFilter.toNgxFilter()
                const expectedResult: IPepSmartFilterData[] = [
                    {
                        fieldId: 'first',
                        operator: {
                            componentType: ['number', 'boolean', 'text'],
                            id: 'eq',
                            name: "EQUAL",
                            short: "="
                        },
                        value: {first: 'a'}
                    },
                    {
                        fieldId: 'second',
                        operator: {
                            componentType: ['number', 'boolean', 'text'],
                            id: 'eq',
                            name: "EQUAL",
                            short: "="
                        },
                        value: {first: 'b'}
                    },
                    {
                        fieldId: 'third',
                        operator: {
                            componentType: ['number', 'boolean', 'text'],
                            id: 'eq',
                            name: "EQUAL",
                            short: "="
                        },
                        value: {first: 'c'}
                    },
                ]
                return expect(ngxFilter).to.be.eql(expectedResult)
            })
        });
    });
})