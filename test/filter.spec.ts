import 'mocha';
import { filter } from '../index';
import { expect } from 'chai';

describe('Filtering objects with JSON Filter', function () {
    describe('Boolean Filter', function () {
        describe('true', function () {
            it('should filter out false values', function () {
                const res = filter([{ TSABool: true }, { TSABool: false }], {
                    FieldType: 'Bool',
                    ApiName: 'TSABool',
                    Operation: 'IsEqual',
                    Values: ['true'],
                });

                expect(res).to.be.an('array').with.lengthOf(1);
                expect(res[0]).to.have.property('TSABool').that.is.true;
            });

            it('should filter out null values', function () {
                const res = filter([{ TSABool: true }, { TSABool: null }], {
                    FieldType: 'Bool',
                    ApiName: 'TSABool',
                    Operation: 'IsEqual',
                    Values: ['true'],
                });

                expect(res).to.be.an('array').with.lengthOf(1);
                expect(res[0]).to.be.an('object').with.property('TSABool').that.is.true;
            });

            it('should filter out undefined values', function () {
                const res = filter([{ TSABool: true }, { TSABool: undefined }], {
                    FieldType: 'Bool',
                    ApiName: 'TSABool',
                    Operation: 'IsEqual',
                    Values: ['true'],
                });
                expect(res).to.be.an('array').with.lengthOf(1);
                expect(res[0]).to.be.an('object').with.property('TSABool').that.is.true;
            });

            it('IsEqual - true: should filter out nonexisting values', function () {
                const res = filter([{ TSABool: true }, {}], {
                    FieldType: 'Bool',
                    ApiName: 'TSABool',
                    Operation: 'IsEqual',
                    Values: ['true'],
                });
                expect(res).to.be.an('array').with.lengthOf(1);
                expect(res[0]).to.be.an('object').with.property('TSABool').that.is.true;
            });

            it("'1' should be considered true", function () {
                const res = filter([{ TSABool: true }, { TSABool: false }], {
                    FieldType: 'Bool',
                    ApiName: 'TSABool',
                    Operation: 'IsEqual',
                    Values: ['1'],
                });
                expect(res).to.be.an('array').with.lengthOf(1);
                expect(res[0]).to.be.an('object').with.property('TSABool').that.is.true;
            });

            it("'TrUe' | '1' should be considered true", function () {
                const res = filter([{ TSABool: 'TrUe' }, { TSABool: '1' }], {
                    FieldType: 'Bool',
                    ApiName: 'TSABool',
                    Operation: 'IsEqual',
                    Values: ['true'],
                });
                expect(res).to.be.an('array').with.lengthOf(2);
                expect(res[0]).to.be.an('object').with.property('TSABool').that.is.equal('TrUe');
                expect(res[1]).to.be.an('object').with.property('TSABool').that.is.equal('1');
            });

            it('{} | [] | -1  should be considered true', function () {
                const res = filter([{ TSABool: {} }, { TSABool: [] }, { TSABool: -1 }], {
                    FieldType: 'Bool',
                    ApiName: 'TSABool',
                    Operation: 'IsEqual',
                    Values: ['true'],
                });
                expect(res).to.be.an('array').with.lengthOf(3);
                expect(res[0]).to.be.an('object').with.property('TSABool').that.is.an('object').which.is.empty;
                expect(res[1]).to.be.an('object').with.property('TSABool').that.is.an('array').which.is.empty;
                expect(res[2]).to.be.an('object').with.property('TSABool').that.is.a('number').which.is.equal(-1);
            });
        });

        describe('false', function () {
            it('should filter out true values', function () {
                const res = filter([{ TSABool: true }, { TSABool: false }], {
                    FieldType: 'Bool',
                    ApiName: 'TSABool',
                    Operation: 'IsEqual',
                    Values: ['false'],
                });

                expect(res).to.be.an('array').with.lengthOf(1);
                expect(res[0]).to.have.property('TSABool').that.is.false;
            });

            it('should not filter out null values', function () {
                const res = filter([{ TSABool: false }, { TSABool: null }], {
                    FieldType: 'Bool',
                    ApiName: 'TSABool',
                    Operation: 'IsEqual',
                    Values: ['false'],
                });

                expect(res).to.be.an('array').with.lengthOf(2);
                expect(res[1]).to.be.an('object').with.property('TSABool').that.is.null;
            });

            it('should not filter out undefined values', function () {
                const res = filter([{ TSABool: false }, { TSABool: undefined }], {
                    FieldType: 'Bool',
                    ApiName: 'TSABool',
                    Operation: 'IsEqual',
                    Values: ['false'],
                });
                expect(res).to.be.an('array').with.lengthOf(2);
                expect(res[1]).to.be.an('object').with.property('TSABool').that.is.undefined;
            });

            it('should not filter out nonexisting values', function () {
                const res = filter([{ TSABool: false }, {}], {
                    FieldType: 'Bool',
                    ApiName: 'TSABool',
                    Operation: 'IsEqual',
                    Values: ['false'],
                });
                expect(res).to.be.an('array').with.lengthOf(2);
                expect(res[1]).to.be.an('object').that.is.empty;
            });

            it("'a' | '' | 'truer' should be considered false", function () {
                const res = filter([{ TSABool: '' }, { TSABool: 'a' }, { TSABool: 'truer' }], {
                    FieldType: 'Bool',
                    ApiName: 'TSABool',
                    Operation: 'IsEqual',
                    Values: ['false'],
                });
                expect(res).to.be.an('array').with.lengthOf(3);
                expect(res[0]).to.be.an('object').with.property('TSABool').that.is.equal('');
                expect(res[1]).to.be.an('object').with.property('TSABool').that.is.equal('a');
                expect(res[2]).to.be.an('object').with.property('TSABool').that.is.equal('truer');
            });
        });
    });

    describe('String Filter', function () {
        describe('IsEqual', function () {
            it('should be equal', function () {
                const res = filter([{ TSAString: 'Hi' }], {
                    FieldType: 'String',
                    ApiName: 'TSAString',
                    Operation: 'IsEqual',
                    Values: ['Hi'],
                });

                expect(res).to.be.an('array').that.has.lengthOf(1);
            });

            it('should not be equal', function () {
                const res = filter([{ TSAString: 'Hilio' }], {
                    FieldType: 'String',
                    ApiName: 'TSAString',
                    Operation: 'IsEqual',
                    Values: ['Hi'],
                });

                expect(res).to.be.an('array').that.has.lengthOf(0);
            });

            it('should be case insenstive', function () {
                const res = filter([{ TSAString: 'hi' }], {
                    FieldType: 'String',
                    ApiName: 'TSAString',
                    Operation: 'IsEqual',
                    Values: ['Hi'],
                });

                expect(res).to.be.an('array').that.has.lengthOf(1);
            });

            it('other types should not be equal to an empty string', function () {
                const res = filter(
                    [
                        { TSAString: 0 },
                        { TSAString: undefined },
                        { TSAString: null },
                        { TSAString: {} },
                        { TSAString: [] },
                        { TSAString: '' },
                    ],
                    {
                        FieldType: 'String',
                        ApiName: 'TSAString',
                        Operation: 'IsEqual',
                        Values: [''],
                    },
                );

                expect(res).to.be.an('array').that.has.lengthOf(6);
            });

            it('should work like IN', function () {
                const res = filter(
                    [{ TSAString: 'hello' }, { TSAString: 'cAsE' }, { TSAString: 'not here' }, { TSAString: 'bye' }],
                    {
                        FieldType: 'String',
                        ApiName: 'TSAString',
                        Operation: 'IsEqual',
                        Values: ['hello', 'case', 'bye'],
                    },
                );

                expect(res).to.be.an('array').that.has.lengthOf(3);
                expect(res[0]).to.be.an('object').with.property('TSAString').that.is.equal('hello');
                expect(res[1]).to.be.an('object').with.property('TSAString').that.is.equal('cAsE');
                expect(res[2]).to.be.an('object').with.property('TSAString').that.is.equal('bye');
            });
        });

        describe('IsNotEqual', function () {
            it('should be equal', function () {
                const res = filter([{ TSAString: 'Hi' }], {
                    FieldType: 'String',
                    ApiName: 'TSAString',
                    Operation: 'IsNotEqual',
                    Values: ['Hi'],
                });

                expect(res).to.be.an('array').that.has.lengthOf(0);
            });

            it('should be not equal', function () {
                const res = filter([{ TSAString: 'Hilio' }], {
                    FieldType: 'String',
                    ApiName: 'TSAString',
                    Operation: 'IsNotEqual',
                    Values: ['Hi'],
                });

                expect(res).to.be.an('array').that.has.lengthOf(1);
            });

            it('should be case insenstive', function () {
                const res = filter([{ TSAString: 'hi' }], {
                    FieldType: 'String',
                    ApiName: 'TSAString',
                    Operation: 'IsNotEqual',
                    Values: ['Hi'],
                });

                expect(res).to.be.an('array').that.has.lengthOf(0);
            });

            it('other types should not be consider an empty string', function () {
                const res = filter(
                    [
                        { TSAString: 0 },
                        { TSAString: undefined },
                        { TSAString: null },
                        { TSAString: {} },
                        { TSAString: [] },
                        { TSAString: '' },
                    ],
                    {
                        FieldType: 'String',
                        ApiName: 'TSAString',
                        Operation: 'IsNotEqual',
                        Values: [''],
                    },
                );

                expect(res).to.be.an('array').that.has.lengthOf(0);
            });

            it('should work like NOT IN', function () {
                const res = filter(
                    [{ TSAString: 'hello' }, { TSAString: 'cAsE' }, { TSAString: 'not here' }, { TSAString: 'bye' }],
                    {
                        FieldType: 'String',
                        ApiName: 'TSAString',
                        Operation: 'IsNotEqual',
                        Values: ['hello', 'case', 'bye'],
                    },
                );

                expect(res).to.be.an('array').that.has.lengthOf(1);
                expect(res[0]).to.be.an('object').with.property('TSAString').that.is.equal('not here');
            });
        });

        describe('IsEmpty', function () {
            it('should be empty', function () {
                const res = filter([{ TSAString: 'Hi' }], {
                    FieldType: 'String',
                    ApiName: 'TSAString',
                    Operation: 'IsEmpty',
                    Values: [],
                });

                expect(res).to.be.an('array').that.has.lengthOf(0);
            });

            it('should be not empty', function () {
                const res = filter([{ TSAString: '' }], {
                    FieldType: 'String',
                    ApiName: 'TSAString',
                    Operation: 'IsEmpty',
                    Values: [],
                });

                expect(res).to.be.an('array').that.has.lengthOf(1);
            });

            it('other types should be considered an empty string', function () {
                const res = filter(
                    [
                        { TSAString: 0 },
                        { TSAString: undefined },
                        { TSAString: null },
                        { TSAString: {} },
                        { TSAString: [] },
                        { TSAString: '' },
                    ],
                    {
                        FieldType: 'String',
                        ApiName: 'TSAString',
                        Operation: 'IsEmpty',
                        Values: [],
                    },
                );

                expect(res).to.be.an('array').that.has.lengthOf(6);
            });
        });

        describe('IsNotEmpty', function () {
            it('should be not empty', function () {
                const res = filter([{ TSAString: 'Hi' }], {
                    FieldType: 'String',
                    ApiName: 'TSAString',
                    Operation: 'IsNotEmpty',
                    Values: [],
                });

                expect(res).to.be.an('array').that.has.lengthOf(1);
            });

            it('should be empty', function () {
                const res = filter([{ TSAString: '' }], {
                    FieldType: 'String',
                    ApiName: 'TSAString',
                    Operation: 'IsNotEmpty',
                    Values: [],
                });

                expect(res).to.be.an('array').that.has.lengthOf(0);
            });

            it('other types should be considered an empty string', function () {
                const res = filter(
                    [
                        { TSAString: 0 },
                        { TSAString: undefined },
                        { TSAString: null },
                        { TSAString: {} },
                        { TSAString: [] },
                        { TSAString: '' },
                    ],
                    {
                        FieldType: 'String',
                        ApiName: 'TSAString',
                        Operation: 'IsNotEmpty',
                        Values: [],
                    },
                );

                expect(res).to.be.an('array').that.has.lengthOf(0);
            });
        });

        describe('Contains', function () {
            it('should be contained', function () {
                const res = filter([{ TSAString: 'Hello' }], {
                    FieldType: 'String',
                    ApiName: 'TSAString',
                    Operation: 'Contains',
                    Values: ['ell'],
                });

                expect(res).to.be.an('array').that.has.lengthOf(1);
            });

            it('should not be contained', function () {
                const res = filter([{ TSAString: 'GoodBye' }], {
                    FieldType: 'String',
                    ApiName: 'TSAString',
                    Operation: 'Contains',
                    Values: ['ell'],
                });

                expect(res).to.be.an('array').that.has.lengthOf(0);
            });

            it('empty string is always contained', function () {
                const res = filter([{ TSAString: '' }, { TSAString: 'Hi' }, { TSAString: 'Goodbye' }], {
                    FieldType: 'String',
                    ApiName: 'TSAString',
                    Operation: 'Contains',
                    Values: [''],
                });

                expect(res).to.be.an('array').that.has.lengthOf(3);
            });

            it('should be case insensitive', function () {
                const res = filter([{ TSAString: 'Goodbye' }], {
                    FieldType: 'String',
                    ApiName: 'TSAString',
                    Operation: 'Contains',
                    Values: ['ODB'],
                });

                expect(res).to.be.an('array').that.has.lengthOf(1);
            });
        });

        describe('StartWith', function () {
            it('should startwith', function () {
                const res = filter([{ TSAString: 'Hello' }], {
                    FieldType: 'String',
                    ApiName: 'TSAString',
                    Operation: 'StartWith',
                    Values: ['Hell'],
                });

                expect(res).to.be.an('array').that.has.lengthOf(1);
            });

            it('should not startwith', function () {
                const res = filter([{ TSAString: 'GoodBye' }], {
                    FieldType: 'String',
                    ApiName: 'TSAString',
                    Operation: 'StartWith',
                    Values: ['ell'],
                });

                expect(res).to.be.an('array').that.has.lengthOf(0);
            });

            it('should not start with but is contained', function () {
                const res = filter([{ TSAString: 'GoodBye' }], {
                    FieldType: 'String',
                    ApiName: 'TSAString',
                    Operation: 'StartWith',
                    Values: ['odb'],
                });

                expect(res).to.be.an('array').that.has.lengthOf(0);
            });

            it('every string starts with an empty string', function () {
                const res = filter([{ TSAString: '' }, { TSAString: 'Hi' }, { TSAString: 'Goodbye' }], {
                    FieldType: 'String',
                    ApiName: 'TSAString',
                    Operation: 'StartWith',
                    Values: [''],
                });

                expect(res).to.be.an('array').that.has.lengthOf(3);
            });

            it('should be case insensitive', function () {
                const res = filter([{ TSAString: 'Goodbye' }], {
                    FieldType: 'String',
                    ApiName: 'TSAString',
                    Operation: 'Contains',
                    Values: ['go'],
                });

                expect(res).to.be.an('array').that.has.lengthOf(1);
            });
        });

        describe('EndWith', function () {
            it('should end with', function () {
                const res = filter([{ TSAString: 'Hello' }], {
                    FieldType: 'String',
                    ApiName: 'TSAString',
                    Operation: 'EndWith',
                    Values: ['ello'],
                });

                expect(res).to.be.an('array').that.has.lengthOf(1);
            });

            it('should not startwith', function () {
                const res = filter([{ TSAString: 'GoodBye' }], {
                    FieldType: 'String',
                    ApiName: 'TSAString',
                    Operation: 'EndWith',
                    Values: ['ello'],
                });

                expect(res).to.be.an('array').that.has.lengthOf(0);
            });

            it('should not end with but is contained', function () {
                const res = filter([{ TSAString: 'GoodBye' }], {
                    FieldType: 'String',
                    ApiName: 'TSAString',
                    Operation: 'EndWith',
                    Values: ['odb'],
                });

                expect(res).to.be.an('array').that.has.lengthOf(0);
            });

            it('every string ends with an empty string', function () {
                const res = filter([{ TSAString: '' }, { TSAString: 'Hi' }, { TSAString: 'Goodbye' }], {
                    FieldType: 'String',
                    ApiName: 'TSAString',
                    Operation: 'EndWith',
                    Values: [''],
                });

                expect(res).to.be.an('array').that.has.lengthOf(3);
            });

            it('should be case insensitive', function () {
                const res = filter([{ TSAString: 'Goodbye' }], {
                    FieldType: 'String',
                    ApiName: 'TSAString',
                    Operation: 'EndWith',
                    Values: ['Bye'],
                });

                expect(res).to.be.an('array').that.has.lengthOf(1);
            });
        });
    });

    describe('Integer & Double Filter', function () {
        describe('=', function () {
            it('should be equal', function () {
                const res1 = filter([{ TSAInteger: 1, TSADouble: 1.0 }], {
                    FieldType: 'Integer',
                    ApiName: 'TSAInteger',
                    Operation: '=',
                    Values: ['1'],
                });
                const res2 = filter([{ TSAInteger: 1, TSADouble: 1.0 }], {
                    FieldType: 'Double',
                    ApiName: 'TSADouble',
                    Operation: '=',
                    Values: ['1.0'],
                });
                expect(res1).to.be.an('array').with.lengthOf(1);
                expect(res2).to.be.an('array').with.lengthOf(1);
            });

            it('should not be equal', function () {
                const res1 = filter([{ TSAInteger: 2, TSADouble: 2.0 }], {
                    FieldType: 'Integer',
                    ApiName: 'TSAInteger',
                    Operation: '=',
                    Values: ['1'],
                });
                const res2 = filter([{ TSAInteger: 2, TSADouble: 2.0 }], {
                    FieldType: 'Double',
                    ApiName: 'TSADouble',
                    Operation: '=',
                    Values: ['1.0'],
                });
                expect(res1).to.be.an('array').with.lengthOf(0);
                expect(res2).to.be.an('array').with.lengthOf(0);
            });

            it('should not be equal', function () {
                const res1 = filter([{ TSAInteger: 1.5, TSADouble: 1 }], {
                    FieldType: 'Integer',
                    ApiName: 'TSAInteger',
                    Operation: '=',
                    Values: ['1'],
                });
                const res2 = filter([{ TSAInteger: 1, TSADouble: 1.0 }], {
                    FieldType: 'Double',
                    ApiName: 'TSADouble',
                    Operation: '=',
                    Values: ['1.5'],
                });
                expect(res1).to.be.an('array').with.lengthOf(0);
                expect(res2).to.be.an('array').with.lengthOf(0);
            });
        });

        describe('!=', function () {
            it('should not be not equal', function () {
                const res1 = filter([{ TSAInteger: 1, TSADouble: 1.0 }], {
                    FieldType: 'Integer',
                    ApiName: 'TSAInteger',
                    Operation: '!=',
                    Values: ['1'],
                });
                const res2 = filter([{ TSAInteger: 1, TSADouble: 1.0 }], {
                    FieldType: 'Double',
                    ApiName: 'TSADouble',
                    Operation: '!=',
                    Values: ['1.0'],
                });
                expect(res1).to.be.an('array').with.lengthOf(0);
                expect(res2).to.be.an('array').with.lengthOf(0);
            });

            it('should be not equal', function () {
                const res1 = filter([{ TSAInteger: 2, TSADouble: 2.0 }], {
                    FieldType: 'Integer',
                    ApiName: 'TSAInteger',
                    Operation: '!=',
                    Values: ['1'],
                });
                const res2 = filter([{ TSAInteger: 2, TSADouble: 2.0 }], {
                    FieldType: 'Double',
                    ApiName: 'TSADouble',
                    Operation: '!=',
                    Values: ['1.0'],
                });
                expect(res1).to.be.an('array').with.lengthOf(1);
                expect(res2).to.be.an('array').with.lengthOf(1);
            });
        });

        describe('>', function () {
            it('should be greater', function () {
                const res1 = filter([{ TSAInteger: 1, TSADouble: 1.0 }], {
                    FieldType: 'Integer',
                    ApiName: 'TSAInteger',
                    Operation: '>',
                    Values: ['0'],
                });
                const res2 = filter([{ TSAInteger: 1, TSADouble: 1.0 }], {
                    FieldType: 'Double',
                    ApiName: 'TSADouble',
                    Operation: '>',
                    Values: ['0.5'],
                });
                expect(res1).to.be.an('array').with.lengthOf(1);
                expect(res2).to.be.an('array').with.lengthOf(1);
            });

            it('should not be greater', function () {
                const res1 = filter([{ TSAInteger: 0, TSADouble: 0.5 }], {
                    FieldType: 'Integer',
                    ApiName: 'TSAInteger',
                    Operation: '>',
                    Values: ['1'],
                });
                const res2 = filter([{ TSAInteger: 1, TSADouble: 1.0 }], {
                    FieldType: 'Double',
                    ApiName: 'TSADouble',
                    Operation: '>',
                    Values: ['1.0'],
                });
                expect(res1).to.be.an('array').with.lengthOf(0);
                expect(res2).to.be.an('array').with.lengthOf(0);
            });
        });

        describe('>=', function () {
            it('should be greater or equal', function () {
                const res1 = filter(
                    [
                        { TSAInteger: 1, TSADouble: 1.0 },
                        { TSAInteger: 2, TSADouble: 2.5 },
                    ],
                    {
                        FieldType: 'Integer',
                        ApiName: 'TSAInteger',
                        Operation: '>=',
                        Values: ['1'],
                    },
                );
                const res2 = filter(
                    [
                        { TSAInteger: 1, TSADouble: 1.0 },
                        { TSAInteger: 2, TSADouble: 2.5 },
                    ],
                    {
                        FieldType: 'Double',
                        ApiName: 'TSADouble',
                        Operation: '>=',
                        Values: ['1.0'],
                    },
                );
                expect(res1).to.be.an('array').with.lengthOf(2);
                expect(res2).to.be.an('array').with.lengthOf(2);
            });

            it('should not be greater or equal', function () {
                const res1 = filter([{ TSAInteger: 0, TSADouble: 0.5 }], {
                    FieldType: 'Integer',
                    ApiName: 'TSAInteger',
                    Operation: '>=',
                    Values: ['1'],
                });
                const res2 = filter([{ TSAInteger: 0, TSADouble: 0.5 }], {
                    FieldType: 'Double',
                    ApiName: 'TSADouble',
                    Operation: '>=',
                    Values: ['1.0'],
                });
                expect(res1).to.be.an('array').with.lengthOf(0);
                expect(res2).to.be.an('array').with.lengthOf(0);
            });
        });

        describe('<', function () {
            it('should be less than', function () {
                const res1 = filter([{ TSAInteger: 1, TSADouble: 1.0 }], {
                    FieldType: 'Integer',
                    ApiName: 'TSAInteger',
                    Operation: '<',
                    Values: ['2'],
                });
                const res2 = filter([{ TSAInteger: 1, TSADouble: 1.0 }], {
                    FieldType: 'Double',
                    ApiName: 'TSADouble',
                    Operation: '<',
                    Values: ['1.5'],
                });
                expect(res1).to.be.an('array').with.lengthOf(1);
                expect(res2).to.be.an('array').with.lengthOf(1);
            });

            it('should not be less than', function () {
                const res1 = filter(
                    [
                        { TSAInteger: 1, TSADouble: 0.5 },
                        { TSAInteger: 0, TSADouble: 0.0 },
                    ],
                    {
                        FieldType: 'Integer',
                        ApiName: 'TSAInteger',
                        Operation: '<',
                        Values: ['0'],
                    },
                );
                const res2 = filter(
                    [
                        { TSAInteger: 1, TSADouble: 0.5 },
                        { TSAInteger: 0, TSADouble: 0.0 },
                    ],
                    {
                        FieldType: 'Double',
                        ApiName: 'TSADouble',
                        Operation: '<',
                        Values: ['0.0'],
                    },
                );
                expect(res1).to.be.an('array').with.lengthOf(0);
                expect(res2).to.be.an('array').with.lengthOf(0);
            });
        });

        describe('<=', function () {
            it('should be less than or equal', function () {
                const res1 = filter(
                    [
                        { TSAInteger: 1, TSADouble: 1.0 },
                        { TSAInteger: 0, TSADouble: 1.5 },
                    ],
                    {
                        FieldType: 'Integer',
                        ApiName: 'TSAInteger',
                        Operation: '<=',
                        Values: ['1'],
                    },
                );
                const res2 = filter(
                    [
                        { TSAInteger: 1, TSADouble: 1.0 },
                        { TSAInteger: 0, TSADouble: 1.5 },
                    ],
                    {
                        FieldType: 'Double',
                        ApiName: 'TSADouble',
                        Operation: '<=',
                        Values: ['1.5'],
                    },
                );
                expect(res1).to.be.an('array').with.lengthOf(2);
                expect(res2).to.be.an('array').with.lengthOf(2);
            });

            it('should not be less than or equal', function () {
                const res1 = filter([{ TSAInteger: 2, TSADouble: 0.5 }], {
                    FieldType: 'Integer',
                    ApiName: 'TSAInteger',
                    Operation: '<=',
                    Values: ['1'],
                });
                const res2 = filter([{ TSAInteger: 1, TSADouble: 1.5 }], {
                    FieldType: 'Double',
                    ApiName: 'TSADouble',
                    Operation: '<=',
                    Values: ['1.0'],
                });
                expect(res1).to.be.an('array').with.lengthOf(0);
                expect(res2).to.be.an('array').with.lengthOf(0);
            });
        });
    });

    describe('Date Time Filter', function () {
        describe('=', function () {
            it('should be equal', function () {
                const res = filter([{ TSADateTime: '2020-06-04T09:08:30.783Z' }], {
                    FieldType: 'DateTime',
                    ApiName: 'TSADateTime',
                    Operation: '=',
                    Values: ['2020-06-04T09:08:30.783Z'],
                });
                expect(res).to.be.an('array').with.lengthOf(1);
            });
            it('should not be equal', function () {
                const res = filter([{ TSADateTime: '2020-06-04T09:09:49.076Z' }], {
                    FieldType: 'DateTime',
                    ApiName: 'TSADateTime',
                    Operation: '=',
                    Values: ['2020-06-04T09:08:30.783Z'],
                });
                expect(res).to.be.an('array').with.lengthOf(0);
            });
            it('should support multiple date formats', function () {
                const res = filter(
                    [
                        { TSADateTime: '2020-06-04' },
                        { TSADateTime: '2020-06-04T00:00:00.000Z' },
                        { TSADateTime: '2020-06-04T00:00:00Z' },
                    ],
                    {
                        FieldType: 'DateTime',
                        ApiName: 'TSADateTime',
                        Operation: '=',
                        Values: ['2020-06-04T00:00:00.000Z'],
                    },
                );
                expect(res).to.be.an('array').with.lengthOf(3);
            });
        });

        describe('!=', function () {
            it('should be not equal', function () {
                const res = filter([{ TSADateTime: '2020-06-04T09:08:30.783Z' }, { TSADateTime: '2020-06-04' }], {
                    FieldType: 'DateTime',
                    ApiName: 'TSADateTime',
                    Operation: '!=',
                    Values: ['2020-06-04T09:08:30.782Z'],
                });
                expect(res).to.be.an('array').with.lengthOf(2);
            });
            it('should not be not equal', function () {
                const res = filter([{ TSADateTime: '2020-06-04T09:09:49.076Z' }], {
                    FieldType: 'DateTime',
                    ApiName: 'TSADateTime',
                    Operation: '!=',
                    Values: ['2020-06-04T09:09:49.076Z'],
                });
                expect(res).to.be.an('array').with.lengthOf(0);
            });
        });

        describe('>', function () {
            it('should be greater', function () {
                const res = filter([{ TSADateTime: '2020-06-04T09:09:49.077Z' }], {
                    FieldType: 'DateTime',
                    ApiName: 'TSADateTime',
                    Operation: '>',
                    Values: ['2020-06-04T09:09:49.076Z'],
                });
                expect(res).to.be.an('array').with.lengthOf(1);
            });
            it('should not be greater', function () {
                const res = filter(
                    [{ TSADateTime: '2020-06-04T09:09:49.075Z' }, { TSADateTime: '2020-06-04T09:09:49.076Z' }],
                    {
                        FieldType: 'DateTime',
                        ApiName: 'TSADateTime',
                        Operation: '>',
                        Values: ['2020-06-04T09:09:49.076Z'],
                    },
                );
                expect(res).to.be.an('array').with.lengthOf(0);
            });
        });
        describe('>=', function () {
            it('should be greater or equal', function () {
                const res = filter(
                    [{ TSADateTime: '2020-06-04T09:09:49.077Z' }, { TSADateTime: '2020-06-04T09:09:49.076Z' }],
                    {
                        FieldType: 'DateTime',
                        ApiName: 'TSADateTime',
                        Operation: '>=',
                        Values: ['2020-06-04T09:09:49.076Z'],
                    },
                );
                expect(res).to.be.an('array').with.lengthOf(2);
            });
            it('should not be greater or equal', function () {
                const res = filter([{ TSADateTime: '2020-06-04T09:09:49.075Z' }], {
                    FieldType: 'DateTime',
                    ApiName: 'TSADateTime',
                    Operation: '>=',
                    Values: ['2020-06-04T09:09:49.076Z'],
                });
                expect(res).to.be.an('array').with.lengthOf(0);
            });
        });
        describe('<', function () {
            it('should be less than', function () {
                const res = filter([{ TSADateTime: '2020-06-04T09:09:49.077Z' }], {
                    FieldType: 'DateTime',
                    ApiName: 'TSADateTime',
                    Operation: '<',
                    Values: ['2020-06-04T09:09:49.078Z'],
                });
                expect(res).to.be.an('array').with.lengthOf(1);
            });
            it('should not be less than', function () {
                const res = filter(
                    [{ TSADateTime: '2020-06-04T09:09:49.078Z' }, { TSADateTime: '2020-06-04T09:09:49.079Z' }],
                    {
                        FieldType: 'DateTime',
                        ApiName: 'TSADateTime',
                        Operation: '<',
                        Values: ['2020-06-04T09:09:49.078Z'],
                    },
                );
                expect(res).to.be.an('array').with.lengthOf(0);
            });
        });
        describe('<=', function () {
            it('should be less than or equal', function () {
                const res = filter(
                    [{ TSADateTime: '2020-06-04T09:09:49.077Z' }, { TSADateTime: '2020-06-04T09:09:49.076Z' }],
                    {
                        FieldType: 'DateTime',
                        ApiName: 'TSADateTime',
                        Operation: '<=',
                        Values: ['2020-06-04T09:09:49.077Z'],
                    },
                );
                expect(res).to.be.an('array').with.lengthOf(2);
            });
            it('should not be less than or equal', function () {
                const res = filter([{ TSADateTime: '2020-06-04T09:09:49.078Z' }], {
                    FieldType: 'DateTime',
                    ApiName: 'TSADateTime',
                    Operation: '<=',
                    Values: ['2020-06-04T09:09:49.077Z'],
                });
                expect(res).to.be.an('array').with.lengthOf(0);
            });
        });

        describe('IsEmpty', function () {
            it('should be empty', function () {
                const res = filter([{ TSADateTime: '' }], {
                    FieldType: 'DateTime',
                    ApiName: 'TSADateTime',
                    Operation: 'IsEmpty',
                    Values: [],
                });
                expect(res).to.be.an('array').with.lengthOf(1);
            });
            it('should not be empty', function () {
                const res = filter([{ TSADateTime: '2020-06-04T09:09:49.078Z' }], {
                    FieldType: 'DateTime',
                    ApiName: 'TSADateTime',
                    Operation: 'IsEmpty',
                    Values: [],
                });
                expect(res).to.be.an('array').with.lengthOf(0);
            });
        });
        describe('IsNotEmpty', function () {
            it('should be not empty', function () {
                const res = filter([{ TSADateTime: '2020-06-04T09:09:49.078Z' }], {
                    FieldType: 'DateTime',
                    ApiName: 'TSADateTime',
                    Operation: 'IsNotEmpty',
                    Values: [],
                });
                expect(res).to.be.an('array').with.lengthOf(1);
            });
            it('should not be not empty', function () {
                const res = filter([{ TSADateTime: '' }], {
                    FieldType: 'DateTime',
                    ApiName: 'TSADateTime',
                    Operation: 'IsNotEmpty',
                    Values: [],
                });
                expect(res).to.be.an('array').with.lengthOf(0);
            });
        });

        describe('UnSupported Operations', function () {
            it('should throw', function () {
                expect(
                    filter([], {
                        FieldType: 'DateTime',
                        ApiName: 'TSADateTime',
                        Operation: 'Today',
                        Values: [],
                    }),
                ).to.throw;
                expect(
                    filter([], {
                        FieldType: 'DateTime',
                        ApiName: 'TSADateTime',
                        Operation: 'ThisWeek',
                        Values: [],
                    }),
                ).to.throw;
                expect(
                    filter([], {
                        FieldType: 'DateTime',
                        ApiName: 'TSADateTime',
                        Operation: 'ThisMonth',
                        Values: [],
                    }),
                ).to.throw;
                expect(
                    filter([], {
                        FieldType: 'DateTime',
                        ApiName: 'TSADateTime',
                        Operation: 'On',
                        Values: ['2020-06-04T09:27:46.147Z'],
                    }),
                ).to.throw;
                expect(
                    filter([], {
                        FieldType: 'DateTime',
                        ApiName: 'TSADateTime',
                        Operation: 'Before',
                        Values: ['2020-06-04T09:27:46.147Z'],
                    }),
                ).to.throw;
                expect(
                    filter([], {
                        FieldType: 'DateTime',
                        ApiName: 'TSADateTime',
                        Operation: 'After',
                        Values: ['2020-06-04T09:27:46.147Z'],
                    }),
                ).to.throw;
                expect(
                    filter([], {
                        FieldType: 'DateTime',
                        ApiName: 'TSADateTime',
                        Operation: 'Between',
                        Values: ['2020-06-04T09:27:46.147Z', ''],
                    }),
                ).to.throw;
                expect(
                    filter([], {
                        FieldType: 'DateTime',
                        ApiName: 'TSADateTime',
                        Operation: 'DueIn',
                        Values: ['10', 'Days'],
                    }),
                ).to.throw;
                expect(
                    filter([], {
                        FieldType: 'DateTime',
                        ApiName: 'TSADateTime',
                        Operation: 'NotDueIn',
                        Values: ['10', 'Days'],
                    }),
                ).to.throw;
                expect(
                    filter([], {
                        FieldType: 'DateTime',
                        ApiName: 'TSADateTime',
                        Operation: 'InTheLast',
                        Values: ['10', 'Days'],
                    }),
                ).to.throw;
                expect(
                    filter([], {
                        FieldType: 'DateTime',
                        ApiName: 'TSADateTime',
                        Operation: 'NotInTheLast',
                        Values: ['10', 'Days'],
                    }),
                ).to.throw;
            });
        });
    });

    describe('Guid Filter', function () {
        describe('IsEqual', function () {
            it('should be equal', function () {
                const res = filter([{ TSAGuid: 'fa3518ee-b84e-4d7c-8ca5-e97e071fe310' }], {
                    FieldType: 'Guid',
                    Operation: 'IsEqual',
                    ApiName: 'TSAGuid',
                    Values: ['fa3518ee-b84e-4d7c-8ca5-e97e071fe310'],
                });
                expect(res).to.be.an('array').with.lengthOf(1);
            });
            it('should not be equal', function () {
                const res = filter([{ TSAGuid: 'c6422c48-5719-408f-827e-a4852596b3d9' }], {
                    FieldType: 'Guid',
                    Operation: 'IsEqual',
                    ApiName: 'TSAGuid',
                    Values: ['fa3518ee-b84e-4d7c-8ca5-e97e071fe310'],
                });
                expect(res).to.be.an('array').with.lengthOf(0);
            });
            it('support mutiple formats', function () {
                const res = filter(
                    [
                        { TSAGuid: 'fa3518ee-b84e-4d7c-8ca5-e97e071fe310' },
                        { TSAGuid: 'FA3518EE-B84E-4D7C-8CA5-E97E071FE310' },
                        { TSAGuid: 'FA3518EEB84E4D7C8CA5E97E071FE310' },
                        { TSAGuid: 'fa3518eeb84e4d7c8ca5e97e071fe310' },
                    ],
                    {
                        FieldType: 'Guid',
                        Operation: 'IsEqual',
                        ApiName: 'TSAGuid',
                        Values: ['fa3518ee-b84e-4d7c-8ca5-e97e071fe310'],
                    },
                );
                expect(res).to.be.an('array').with.lengthOf(4);
            });
        });

        describe('IsNotEqual', function () {
            it('should not be not equal', function () {
                const res = filter([{ TSAGuid: 'fa3518ee-b84e-4d7c-8ca5-e97e071fe310' }], {
                    FieldType: 'Guid',
                    Operation: 'IsNotEqual',
                    ApiName: 'TSAGuid',
                    Values: ['fa3518ee-b84e-4d7c-8ca5-e97e071fe310'],
                });
                expect(res).to.be.an('array').with.lengthOf(0);
            });
            it('should be not equal', function () {
                const res = filter([{ TSAGuid: 'c6422c48-5719-408f-827e-a4852596b3d9' }], {
                    FieldType: 'Guid',
                    Operation: 'IsNotEqual',
                    ApiName: 'TSAGuid',
                    Values: ['fa3518ee-b84e-4d7c-8ca5-e97e071fe310'],
                });
                expect(res).to.be.an('array').with.lengthOf(1);
            });
        });

        describe('IsEmpty', function () {
            it('should be empty', function () {
                const res = filter([{ TSAGuid: '' }], {
                    FieldType: 'Guid',
                    Operation: 'IsEmpty',
                    ApiName: 'TSAGuid',
                    Values: [],
                });
                expect(res).to.be.an('array').with.lengthOf(1);
            });
            it('should not be empty', function () {
                const res = filter([{ TSAGuid: '5b4a63d8-fa54-428b-8da5-b80399846ad8' }], {
                    FieldType: 'Guid',
                    Operation: 'IsEmpty',
                    ApiName: 'TSAGuid',
                    Values: [],
                });
                expect(res).to.be.an('array').with.lengthOf(0);
            });

            it('NULL GUID is considered empty', function () {
                const res = filter([{ TSAGuid: '00000000-0000-0000-0000-000000000000' }], {
                    FieldType: 'Guid',
                    Operation: 'IsEmpty',
                    ApiName: 'TSAGuid',
                    Values: [],
                });
                expect(res).to.be.an('array').with.lengthOf(1);
            });
        });

        describe('IsNotEmpty', function () {
            it('should be not empty', function () {
                const res = filter([{ TSAGuid: '5b4a63d8-fa54-428b-8da5-b80399846ad8' }], {
                    FieldType: 'Guid',
                    Operation: 'IsNotEmpty',
                    ApiName: 'TSAGuid',
                    Values: [],
                });
                expect(res).to.be.an('array').with.lengthOf(1);
            });
            it('should not be not empty', function () {
                const res = filter([{ TSAGuid: '' }, { TSAGuid: '00000000-0000-0000-0000-000000000000' }], {
                    FieldType: 'Guid',
                    Operation: 'IsNotEmpty',
                    ApiName: 'TSAGuid',
                    Values: [],
                });
                expect(res).to.be.an('array').with.lengthOf(0);
            });
        });
    });

    describe('General', function () {
        describe('ApiName support', function () {
            it('should support dot annotation', function () {
                const res = filter(
                    [
                        {
                            'Account.TSAString': 'Hello',
                        },
                    ],
                    {
                        FieldType: 'String',
                        ApiName: 'Account.TSAString',
                        Operation: 'IsEqual',
                        Values: ['Hello'],
                    },
                );
                expect(res).to.be.an('array').with.lengthOf(1);
            });
            it('should support nested objects', function () {
                const res = filter(
                    [
                        {
                            Account: {
                                TSAString: 'Hello',
                            },
                        },
                    ],
                    {
                        FieldType: 'String',
                        ApiName: 'Account.TSAString',
                        Operation: 'IsEqual',
                        Values: ['Hello'],
                    },
                );
                expect(res).to.be.an('array').with.lengthOf(1);
            });
            it('should support nested objects & dot annotation', function () {
                const res = filter(
                    [
                        {
                            Account: {
                                'User.TSAString': 'Hello',
                            },
                        },
                    ],
                    {
                        FieldType: 'String',
                        ApiName: 'Account.User.TSAString',
                        Operation: 'IsEqual',
                        Values: ['Hello'],
                    },
                );
                expect(res).to.be.an('array').with.lengthOf(1);
            });
            it('should support nested arrays', function () {
                const res = filter(
                    [
                        {
                            Arr: ['Hello'],
                        },
                    ],
                    {
                        FieldType: 'String',
                        ApiName: 'Arr[0]',
                        Operation: 'IsEqual',
                        Values: ['Hello'],
                    },
                );
                expect(res).to.be.an('array').with.lengthOf(1);
            });
            it('should support nested arrays & dot annotation', function () {
                const res = filter(
                    [
                        {
                            Arr: [
                                {
                                    Account: {
                                        'User.TSAString': 'Hello',
                                    },
                                },
                            ],
                        },
                    ],
                    {
                        FieldType: 'String',
                        ApiName: 'Arr[0].Account.User.TSAString',
                        Operation: 'IsEqual',
                        Values: ['Hello'],
                    },
                );
                expect(res).to.be.an('array').with.lengthOf(1);
            });
        });

        describe('AND / OR', function () {
            it('should support AND operation', function () {
                const res = filter(
                    [
                        {
                            TSAString: 'Hi',
                            Hidden: false,
                        },
                        {
                            TSAString: 'Hi',
                            Hidden: true,
                        },
                        {
                            TSAString: 'Hello',
                            Hidden: true,
                        },
                        {
                            TSAString: 'Hello',
                            Hidden: false,
                        },
                    ],
                    {
                        Operation: 'AND',
                        RightNode: {
                            FieldType: 'String',
                            ApiName: 'TSAString',
                            Operation: 'IsEqual',
                            Values: ['Hi'],
                        },
                        LeftNode: {
                            FieldType: 'Bool',
                            ApiName: 'Hidden',
                            Operation: 'IsEqual',
                            Values: ['false'],
                        },
                    },
                );

                expect(res).to.be.an('array').with.lengthOf(1);
            });
            it('should support OR operation', function () {
                const res = filter(
                    [
                        {
                            TSAString: 'Hi',
                            Hidden: false,
                        },
                        {
                            TSAString: 'Hi',
                            Hidden: true,
                        },
                        {
                            TSAString: 'Hello',
                            Hidden: true,
                        },
                        {
                            TSAString: 'Hello',
                            Hidden: false,
                        },
                    ],
                    {
                        Operation: 'OR',
                        RightNode: {
                            FieldType: 'String',
                            ApiName: 'TSAString',
                            Operation: 'IsEqual',
                            Values: ['Hi'],
                        },
                        LeftNode: {
                            FieldType: 'Bool',
                            ApiName: 'Hidden',
                            Operation: 'IsEqual',
                            Values: ['false'],
                        },
                    },
                );

                expect(res).to.be.an('array').with.lengthOf(3);
            });
        });
    });
});
