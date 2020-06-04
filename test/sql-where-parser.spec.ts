import 'mocha'
import { expect } from 'chai'
import { JSONFilter } from '../index'
import { SQLWhereParser } from '../sql-where-parser';

interface Test {
    title: string, 
    where: string,
    filter: JSONFilter
}

describe('One level - Guid', () => {
    const uuid1 = '6de02514-30f5-45c5-a55e-c2d9cea039b6';
    const parser = new SQLWhereParser([
        {
            FieldName: 'UUID',
            FieldType: 'Guid'
        }
    ]);
    
    const tests: Test[] = [
        {
            title: 'Equals',
            where: `UUID = '${uuid1}'`,
            filter: {
                ApiName: 'UUID',
                FieldType: 'Guid',
                Operation: 'IsEqual',
                Values: [uuid1]
            }
        },
        {
            title: 'Not Equal (!=)',
            where: `UUID != '${uuid1}'`,
            filter: {
                ApiName: 'UUID',
                FieldType: 'Guid',
                Operation: 'IsNotEqual',
                Values: [uuid1]
            }
        },
        {
            title: 'Not Equal (<>)',
            where: `UUID <> '${uuid1}'`,
            filter: {
                ApiName: 'UUID',
                FieldType: 'Guid',
                Operation: 'IsNotEqual',
                Values: [uuid1]
            }
        },
        {
            title: 'IS NULL',
            where: "UUID IS NULL",
            filter: {
                ApiName: 'UUID',
                FieldType: 'Guid',
                Operation: 'IsEmpty',
                Values: []
            }
        },
        {
            title: 'IS NOT NULL',
            where: "UUID IS NOT NULL",
            filter: {
                ApiName: 'UUID',
                FieldType: 'Guid',
                Operation: 'IsNotEmpty',
                Values: []
            }
        },
    ]

    tests.forEach(test => {
        it(test.title.padStart(15, ' ') + ' | ' + test.where, () => {
            expect(parser.parse(test.where)).to.eql(test.filter);
        })
    })

})

describe('One level - Integer', () => {
    const fieldName = 'TSAInt';
    const fieldType = 'Integer';
    const parser = new SQLWhereParser([
        {
            FieldName: fieldName,
            FieldType: fieldType
        }
    ]);
    
    const tests: Test[] = [
        {
            title: 'Equals',
            where: `${fieldName} = 123`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsEqual',
                Values: ['123']
            }
        },
        {
            title: 'Not Equal (!=)',
            where: `${fieldName} != 123`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsNotEqual',
                Values: ['123']
            }
        },
        {
            title: 'Not Equal (<>)',
            where: `${fieldName} <> ${123}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsNotEqual',
                Values: ['123']
            }
        },
        {
            title: 'BiggerThanOrEquals',
            where: `${fieldName} >= ${123}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '>=',
                Values: ['123']
            }
        },
        {
            title: 'BiggerThan',
            where: `${fieldName} > ${123}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '>',
                Values: ['123']
            }
        },
        {
            title: 'SmallerThanOrEquals',
            where: `${fieldName} <= ${123}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '<=',
                Values: ['123']
            }
        },
        {
            title: 'SmallerThan',
            where: `${fieldName} < ${123}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '<',
                Values: ['123']
            }
        },
        {
            title: 'IS NULL',
            where: `${fieldName} IS NULL`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsEmpty',
                Values: []
            }
        },
        {
            title: 'IS NOT NULL',
            where: `${fieldName} IS NOT NULL`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsNotEmpty',
                Values: []
            }
        },
    ]

    tests.forEach(test => {
        it(test.title.padStart(20, ' ') + ' | ' + test.where, () => {
            expect(parser.parse(test.where)).to.eql(test.filter);
        })
    })

})

describe('One level - Double', () => {
    const fieldName = 'TSADouble';
    const fieldType = 'Double';
    const parser = new SQLWhereParser([
        {
            FieldName: fieldName,
            FieldType: fieldType
        }
    ]);
    
    const tests: Test[] = [
        {
            title: 'Equals',
            where: `${fieldName} = 123.5`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsEqual',
                Values: ['123.5']
            }
        },
        {
            title: 'Not Equal (!=)',
            where: `${fieldName} != 123.5`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsNotEqual',
                Values: ['123.5']
            }
        },
        {
            title: 'Not Equal (<>)',
            where: `${fieldName} <> ${123.5}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsNotEqual',
                Values: ['123.5']
            }
        },
        {
            title: 'BiggerThanOrEquals',
            where: `${fieldName} >= ${123.5}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '>=',
                Values: ['123.5']
            }
        },
        {
            title: 'BiggerThan',
            where: `${fieldName} > ${123.5}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '>',
                Values: ['123.5']
            }
        },
        {
            title: 'SmallerThanOrEquals',
            where: `${fieldName} <= ${123.5}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '<=',
                Values: ['123.5']
            }
        },
        {
            title: 'SmallerThan',
            where: `${fieldName} < ${123.5}`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '<',
                Values: ['123.5']
            }
        },
        {
            title: 'IS NULL',
            where: `${fieldName} IS NULL`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsEmpty',
                Values: []
            }
        },
        {
            title: 'IS NOT NULL',
            where: `${fieldName} IS NOT NULL`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsNotEmpty',
                Values: []
            }
        },
    ]

    tests.forEach(test => {
        it(`${test.title.padStart(20, ' ')} | ${test.where.padEnd(10, ' ')}`, () => {
            expect(parser.parse(test.where)).to.eql(test.filter);
        })
    })

})

describe('One level - String', () => {
    const fieldName = 'TSAString';
    const fieldType = 'String';
    const parser = new SQLWhereParser([
        {
            FieldName: fieldName,
            FieldType: fieldType
        }
    ]);
    
    const tests: Test[] = [
        {
            title: 'Equals',
            where: `${fieldName} = 'Hi'`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsEqual',
                Values: ['Hi']
            }
        },
        {
            title: 'Not Equal (!=)',
            where: `${fieldName} != 'Hi'`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsNotEqual',
                Values: ['Hi']
            }
        },
        {
            title: 'Not Equal (<>)',
            where: `${fieldName} <> 'Hi'`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsNotEqual',
                Values: ['Hi']
            }
        },
        {
            title: 'Contains',
            where: `${fieldName} LIKE '%Hi%'`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'Contains',
                Values: ['Hi']
            }
        },
        {
            title: 'StartsWith',
            where: `${fieldName} LIKE 'Hi%'`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'StartWith',
                Values: ['Hi']
            }
        },
        {
            title: 'EndsWith',
            where: `${fieldName} LIKE '%Hi'`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'EndWith',
                Values: ['Hi']
            }
        },
        {
            title: 'IN',
            where: `${fieldName} IN ('Hi', 'Bye', 'SeeYa')`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsEqual',
                Values: ['Hi', 'Bye', 'SeeYa']
            }
        },
        {
            title: 'NOT IN',
            where: `${fieldName} NOT IN ('Hi', 'Bye', 'SeeYa')`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsNotEqual',
                Values: ['Hi', 'Bye', 'SeeYa']
            }
        },
        {
            title: 'IS NOT NULL',
            where: `${fieldName} IS NOT NULL`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsNotEmpty',
                Values: []
            }
        },
        {
            title: 'IS NOT NULL',
            where: `${fieldName} IS NULL`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsEmpty',
                Values: []
            }
        },
    ]

    tests.forEach(test => {
        it(test.title.padStart(15, ' ') + ' | ' + test.where, () => {
            expect(parser.parse(test.where)).to.eql(test.filter);
        })
    })

})

describe('One level - DateTime', () => {
    const fieldName = 'TSADateTime';
    const fieldType = 'DateTime';
    const now = (new Date()).toISOString();
    const parser = new SQLWhereParser([
        {
            FieldName: fieldName,
            FieldType: fieldType
        }
    ]);
    
    const tests: Test[] = [
        {
            title: '=',
            where: `${fieldName} = '${now}'`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '=',
                Values: [now]
            }
        },
        {
            title: '>',
            where: `${fieldName} > '${now}'`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '>',
                Values: [now]
            }
        },
        {
            title: '>=',
            where: `${fieldName} >= '${now}'`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '>=',
                Values: [now]
            }
        },
        {
            title: '<',
            where: `${fieldName} < '${now}'`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '<',
                Values: [now]
            }
        },
        {
            title: '<=',
            where: `${fieldName} <= '${now}'`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: '<=',
                Values: [now]
            }
        },
        {
            title: 'IS NOT NULL',
            where: `${fieldName} IS NOT NULL`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsNotEmpty',
                Values: []
            }
        },
        {
            title: 'IS NOT NULL',
            where: `${fieldName} IS NULL`,
            filter: {
                ApiName: fieldName,
                FieldType: fieldType,
                Operation: 'IsEmpty',
                Values: []
            }
        },
    ]

    tests.forEach(test => {
        it(test.title.padStart(15, ' ') + ' | ' + test.where, () => {
            expect(parser.parse(test.where)).to.eql(test.filter);
        })
    })

})

describe('Two Levels - AND', () => {

    const parser = new SQLWhereParser([
        {
            FieldName: 'TSAString',
            FieldType: 'String'
        },
        {
            FieldName: 'TSADouble',
            FieldType: 'Double'
        }
    ]);

    const result: JSONFilter = {
        Operation: 'AND',
        LeftNode: {
            FieldType: 'String',
            Operation: 'Contains',
            ApiName: 'TSAString',
            Values: [ 'HI' ]
        },
        RightNode: {
            FieldType: 'Double',
            Operation: '>=',
            ApiName: 'TSADouble',
            Values: [ '123.23' ]
        }
    }
    
    const tests: Test[] = [
        {
            title: 'No Paren\'s',
            where: `TSAString LIKE '%HI%' AND TSADouble >= 123.23`,
            filter: result
        },
        {
            title: 'Single Paren\'s',
            where: `(TSAString LIKE '%HI%') AND (TSADouble >= 123.23)`,
            filter: result
        },
        {
            title: 'Outer Paren\'s',
            where: `(TSAString LIKE '%HI%' AND TSADouble >= 123.23)`,
            filter: result
        },
        {
            title: 'All Paren\'s',
            where: `((TSAString LIKE '%HI%') AND (TSADouble >= 123.23))`,
            filter: result
        },
        {
            title: 'Extra Paren\'s',
            where: `((((TSAString LIKE '%HI%')) AND ((TSADouble >= 123.23))))`,
            filter: result
        },
    ];

    tests.forEach(test => {
        it(test.title.padStart(15, ' ') + ' | ' + test.where, () => {
            expect(parser.parse(test.where)).to.eql(test.filter);
        })
    })
})

describe('Two Levels - OR', () => {

    const parser = new SQLWhereParser([
        {
            FieldName: 'TSAString',
            FieldType: 'String'
        },
        {
            FieldName: 'TSADouble',
            FieldType: 'Double'
        }
    ]);

    const result: JSONFilter = {
        Operation: 'OR',
        LeftNode: {
            FieldType: 'String',
            Operation: 'Contains',
            ApiName: 'TSAString',
            Values: [ 'HI' ]
        },
        RightNode: {
            FieldType: 'Double',
            Operation: '>=',
            ApiName: 'TSADouble',
            Values: [ '123.23' ]
        }
    }
    
    const tests: Test[] = [
        {
            title: 'No Paren\'s',
            where: `TSAString LIKE '%HI%' OR TSADouble >= 123.23`,
            filter: result
        },
        {
            title: 'Single Paren\'s',
            where: `(TSAString LIKE '%HI%') OR (TSADouble >= 123.23)`,
            filter: result
        },
        {
            title: 'Outer Paren\'s',
            where: `(TSAString LIKE '%HI%' OR TSADouble >= 123.23)`,
            filter: result
        },
        {
            title: 'All Paren\'s',
            where: `((TSAString LIKE '%HI%') OR (TSADouble >= 123.23))`,
            filter: result
        },
        {
            title: 'Extra Paren\'s',
            where: `((((TSAString LIKE '%HI%')) OR ((TSADouble >= 123.23))))`,
            filter: result
        },
    ];

    tests.forEach(test => {
        it(test.title.padStart(15, ' ') + ' | ' + test.where, () => {
            expect(parser.parse(test.where)).to.eql(test.filter);
        })
    })
})

describe('Three Levels', () => {

    const parser = new SQLWhereParser([
        {
            FieldName: 'TSAString',
            FieldType: 'String'
        },
        {
            FieldName: 'TSADouble',
            FieldType: 'Double'
        },
        {
            FieldName: 'TSAInteger',
            FieldType: 'Integer'
        }
    ]);

    const f1: JSONFilter = {
        FieldType: 'String',
        Operation: 'Contains',
        ApiName: 'TSAString',
        Values: [ 'HI' ]
    };
    const f2: JSONFilter = {
        FieldType: 'Double',
        Operation: '>=',
        ApiName: 'TSADouble',
        Values: [ '123.23' ]
    };
    const f3: JSONFilter = {
        FieldType: 'Integer',
        Operation: 'IsEqual',
        ApiName: 'TSAInteger',
        Values: [ '123' ]
    }
    
    const tests: Test[] = [
        {
            title: 'f1 AND f2 OR f3',
            where: `TSAString LIKE '%HI%' AND TSADouble >= 123.23 OR TSAInteger = 123`,
            filter: {
                Operation: 'OR',
                LeftNode: {
                    Operation: 'AND',
                    LeftNode: f1,
                    RightNode: f2
                },
                RightNode: f3
            }
        },
        {
            title: '(f1 AND f2) OR f3',
            where: `(TSAString LIKE '%HI%' AND TSADouble >= 123.23) OR TSAInteger = 123`,
            filter: {
                Operation: 'OR',
                LeftNode: {
                    Operation: 'AND',
                    LeftNode: f1,
                    RightNode: f2
                },
                RightNode: f3
            }
        },
        {
            title: 'f1 AND (f2 OR f3)',
            where: `TSAString LIKE '%HI%' AND (TSADouble >= 123.23 OR TSAInteger = 123)`,
            filter: {
                Operation: 'AND',
                LeftNode: f1,
                RightNode: {
                    Operation: 'OR',
                    LeftNode: f2,
                    RightNode: f3
                }
            }
        },
    ];

    tests.forEach(test => {
        it(test.title.padStart(15, ' ') + ' | ' + test.where, () => {
            expect(parser.parse(test.where)).to.eql(test.filter);
        })
    })
})