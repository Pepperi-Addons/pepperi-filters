import 'mocha'
import { expect } from 'chai'
import { JSONFilterTransformer } from '../json-filter-transformer'
import { JSONFilter, JSONBaseFilter } from '../json-filter';

// Creating tranformer for use in all the tests
// The fieldNames are real life examples for the DataViews model 
// which is built on the UIControl model
const transformer = new JSONFilterTransformer(new Map([
    
    // Type doesn't exist on UIControls
    ['Type', (node: JSONBaseFilter): boolean => { return false } ],
    
    // Context.Name maps to part of UIControl.Type
    ['Context.Name', (node: JSONBaseFilter) => { 

        // no matter what the operation - it is alway only contains
        node.Operation = 'Contains'
        node.ApiName = 'Type'

        return true 
    } ],

     // Context.ScreenSize maps to the suffix of UIControl.Type
    ['Context.ScreenSize', (node: JSONBaseFilter) => { 

        const screenSize = node.Values[0];
        if (screenSize == 'Tablet') { // default
            return false;
        }
        
        node.Operation = 'EndWith'
        node.ApiName = 'Type'

        return true 
    } ],
]));


describe('One Level', () => {
    
    const tests: { title: string, input: JSONFilter, expected: JSONFilter | undefined }[] = [
        {
            title: 'No changes',
            input: {
                FieldType: 'Bool',
                ApiName: 'Hidden',
                Operation: 'IsEqual',
                Values: []
            },
            expected: {
                FieldType: 'Bool',
                ApiName: 'Hidden',
                Operation: 'IsEqual',
                Values: []
            }
        },
        {
            title: 'Transformed',
            input: {
                FieldType: 'String',
                ApiName: 'Context.Name',
                Operation: 'IsEqual',
                Values: [ 'OrderMenu' ]
            },
            expected: {
                FieldType: 'String',
                ApiName: 'Type',
                Operation: 'Contains',
                Values: [ 'OrderMenu' ]
            }
        },
        {
            title: 'Not supported',
            input: {
                FieldType: 'String',
                ApiName: 'Type',
                Operation: 'IsEqual',
                Values: [ 'Grid' ]
            },
            expected: undefined
        }

    ]

    tests.forEach(test => {
        it(test.title, () => {
            expect(transformer.transform(test.input)).to.be.eql(test.expected);
        })
    })
})

describe('Two Levels', () => {
    
    const tests: { title: string, input: JSONFilter, expected: JSONFilter | undefined }[] = [
        {
            title: 'No changes (AND)',
            input: {
                Operation: 'AND',
                LeftNode: {
                    FieldType: 'Bool',
                    ApiName: 'Hidden',
                    Operation: 'IsEqual',
                    Values: []
                },
                RightNode: {
                    FieldType: 'DateTime',
                    ApiName: 'CreationDate',
                    Operation: 'IsNotEmpty',
                    Values: []
                }
            },
            expected: {
                Operation: 'AND',
                LeftNode: {
                    FieldType: 'Bool',
                    ApiName: 'Hidden',
                    Operation: 'IsEqual',
                    Values: []
                },
                RightNode: {
                    FieldType: 'DateTime',
                    ApiName: 'CreationDate',
                    Operation: 'IsNotEmpty',
                    Values: []
                }
            }
        },
        {
            title: 'No changes (OR)',
            input: {
                Operation: 'OR',
                LeftNode: {
                    FieldType: 'Bool',
                    ApiName: 'Hidden',
                    Operation: 'IsEqual',
                    Values: []
                },
                RightNode: {
                    FieldType: 'DateTime',
                    ApiName: 'CreationDate',
                    Operation: 'IsNotEmpty',
                    Values: []
                }
            },
            expected: {
                Operation: 'OR',
                LeftNode: {
                    FieldType: 'Bool',
                    ApiName: 'Hidden',
                    Operation: 'IsEqual',
                    Values: []
                },
                RightNode: {
                    FieldType: 'DateTime',
                    ApiName: 'CreationDate',
                    Operation: 'IsNotEmpty',
                    Values: []
                }
            }
        },
        {
            title: 'Transformed (AND)',
            input: {
                Operation: 'AND',
                LeftNode: {
                    FieldType: 'String',
                    ApiName: 'Context.Name',
                    Operation: 'IsEqual',
                    Values: [ 'OrderMenu' ]
                },
                RightNode: {
                    FieldType: 'DateTime',
                    ApiName: 'CreationDate',
                    Operation: 'IsNotEmpty',
                    Values: []
                }
            },
            expected: {
                Operation: 'AND',
                LeftNode: {
                    FieldType: 'String',
                    ApiName: 'Type',
                    Operation: 'Contains',
                    Values: [ 'OrderMenu' ]
                },
                RightNode: {
                    FieldType: 'DateTime',
                    ApiName: 'CreationDate',
                    Operation: 'IsNotEmpty',
                    Values: []
                }
            }
        },
        {
            title: 'One Unsupported (AND)',
            input: {
                Operation: 'AND',
                LeftNode: {
                    FieldType: 'String',
                    ApiName: 'Type',
                    Operation: 'IsEqual',
                    Values: [ 'Grid' ]
                },
                RightNode: {
                    FieldType: 'DateTime',
                    ApiName: 'CreationDate',
                    Operation: 'IsNotEmpty',
                    Values: []
                }
            },
            expected: {
                FieldType: 'DateTime',
                ApiName: 'CreationDate',
                Operation: 'IsNotEmpty',
                Values: []
            }
        },
        {
            title: 'One Unsupported (OR)',
            input: {
                Operation: 'OR',
                LeftNode: {
                    FieldType: 'String',
                    ApiName: 'Type',
                    Operation: 'IsEqual',
                    Values: [ 'Grid' ]
                },
                RightNode: {
                    FieldType: 'DateTime',
                    ApiName: 'CreationDate',
                    Operation: 'IsNotEmpty',
                    Values: []
                }
            },
            expected: undefined
        },
        {
            title: 'Both Unsupported (AND)',
            input: {
                Operation: 'AND',
                LeftNode: {
                    FieldType: 'String',
                    ApiName: 'Type',
                    Operation: 'IsEqual',
                    Values: [ 'Grid' ]
                },
                RightNode: {
                    FieldType: 'String',
                    ApiName: 'Type',
                    Operation: 'StartWith',
                    Values: [ 'Gr' ]
                }
            },
            expected: undefined
        },
        {
            title: 'Both Unsupported (OR)',
            input: {
                Operation: 'OR',
                LeftNode: {
                    FieldType: 'String',
                    ApiName: 'Type',
                    Operation: 'IsEqual',
                    Values: [ 'Grid' ]
                },
                RightNode: {
                    FieldType: 'String',
                    ApiName: 'Type',
                    Operation: 'StartWith',
                    Values: [ 'Gr' ]
                }
            },
            expected: undefined
        },
    ]

    tests.forEach(test => {
        it(test.title, () => {
            expect(transformer.transform(test.input)).to.be.eql(test.expected);
        })
    })
})

describe('Three Levels', () => {
    
    const tests: { title: string, input: JSONFilter, expected: JSONFilter | undefined }[] = [
        {
            title: 'Or till the top - undefined',
            input: {
                Operation: 'OR',
                LeftNode: {
                    Operation: 'AND',
                    LeftNode: {
                        FieldType: 'Bool',
                        ApiName: 'Hidden',
                        Operation: 'IsEqual',
                        Values: []
                    },
                    RightNode: {
                        FieldType: 'DateTime',
                        ApiName: 'CreationDate',
                        Operation: 'IsNotEmpty',
                        Values: []
                    }
                },
                RightNode: {
                    Operation: 'OR',
                    LeftNode: {
                        FieldType: 'String',
                        ApiName: 'Type',
                        Operation: 'IsEqual',
                        Values: [ 'Grid' ]
                    },
                    RightNode: {
                        FieldType: 'DateTime',
                        ApiName: 'CreationDate',
                        Operation: 'IsNotEmpty',
                        Values: []
                    }
                }
            },
            expected: undefined
        },
        {
            title: 'AND at the top',
            input: {
                Operation: 'AND',
                LeftNode: {
                    Operation: 'AND',
                    LeftNode: {
                        FieldType: 'Bool',
                        ApiName: 'Hidden',
                        Operation: 'IsEqual',
                        Values: []
                    },
                    RightNode: {
                        FieldType: 'DateTime',
                        ApiName: 'CreationDate',
                        Operation: 'IsNotEmpty',
                        Values: []
                    }
                },
                RightNode: {
                    Operation: 'OR',
                    LeftNode: {
                        FieldType: 'String',
                        ApiName: 'Type',
                        Operation: 'IsEqual',
                        Values: [ 'Grid' ]
                    },
                    RightNode: {
                        FieldType: 'DateTime',
                        ApiName: 'CreationDate',
                        Operation: 'IsNotEmpty',
                        Values: []
                    }
                }
            },
            expected: {
                Operation: 'AND',
                LeftNode: {
                    FieldType: 'Bool',
                    ApiName: 'Hidden',
                    Operation: 'IsEqual',
                    Values: []
                },
                RightNode: {
                    FieldType: 'DateTime',
                    ApiName: 'CreationDate',
                    Operation: 'IsNotEmpty',
                    Values: []
                }
            }
        },
    ]

    tests.forEach(test => {
        it(test.title, () => {
            expect(transformer.transform(test.input)).to.be.eql(test.expected);
        })
    })
})