import 'mocha';
import { concat } from '../index';
import { expect } from 'chai';

describe('Where concatination', function () {
    describe('AND', function () {
        it('1 filters', function () {
            expect(concat(true, 'Hi = 123')).to.be.equal('Hi = 123');
        });
        it('2 filters', function () {
            expect(concat(true, 'Hi = 123', 'Bear < 3')).to.be.equal('(Hi = 123 AND Bear < 3)');
        });
        it('3 filters', function () {
            expect(concat(true, 'Hi = 123', 'Bear < 3', "Deer LIKE 'Rabbit'")).to.be.equal(
                "(Hi = 123 AND Bear < 3 AND Deer LIKE 'Rabbit')",
            );
        });
        it('3 filters - 1 empty', function () {
            expect(concat(true, 'Hi = 123', '', "Deer LIKE 'Rabbit'")).to.be.equal("(Hi = 123 AND Deer LIKE 'Rabbit')");
        });
        it('3 filters - 1 undefined', function () {
            expect(concat(true, 'Hi = 123', undefined, "Deer LIKE 'Rabbit'")).to.be.equal(
                "(Hi = 123 AND Deer LIKE 'Rabbit')",
            );
        });
    });

    describe('OR', function () {
        it('1 filters', function () {
            expect(concat(false, 'Hi = 123')).to.be.equal('Hi = 123');
        });
        it('2 filters', function () {
            expect(concat(false, 'Hi = 123', 'Bear < 3')).to.be.equal('(Hi = 123 OR Bear < 3)');
        });
        it('3 filters', function () {
            expect(concat(false, 'Hi = 123', 'Bear < 3', "Deer LIKE 'Rabbit'")).to.be.equal(
                "(Hi = 123 OR Bear < 3 OR Deer LIKE 'Rabbit')",
            );
        });
        it('3 filters - 1 empty', function () {
            expect(concat(false, 'Hi = 123', '', "Deer LIKE 'Rabbit'")).to.be.equal("(Hi = 123 OR Deer LIKE 'Rabbit')");
        });
        it('3 filters - 1 undefined', function () {
            expect(concat(false, 'Hi = 123', undefined, "Deer LIKE 'Rabbit'")).to.be.equal(
                "(Hi = 123 OR Deer LIKE 'Rabbit')",
            );
        });
    });

    describe('Mixed', function () {
        it('3 filters', function () {
            expect(concat(true, concat(false, 'Hi = 123', 'Bear < 2'), "Deer LIKE 'Rabbit'")).to.be.equal(
                "((Hi = 123 OR Bear < 2) AND Deer LIKE 'Rabbit')",
            );
        });
    });
});

describe('JSON Filter concatination', function () {
    describe('AND', function () {
        it('1 filters', function () {
            expect(
                concat(true, {
                    FieldType: 'Integer',
                    ApiName: 'Hi',
                    Operation: 'IsEqual',
                    Values: ['123'],
                }),
            ).to.be.deep.equal({
                FieldType: 'Integer',
                ApiName: 'Hi',
                Operation: 'IsEqual',
                Values: ['123'],
            });
        });
        it('2 filters', function () {
            expect(
                concat(
                    true,
                    {
                        FieldType: 'Integer',
                        ApiName: 'Hi',
                        Operation: 'IsEqual',
                        Values: ['123'],
                    },
                    {
                        FieldType: 'Integer',
                        ApiName: 'Bear',
                        Operation: '<',
                        Values: ['3'],
                    },
                ),
            ).to.be.deep.equal({
                Operation: 'AND',
                LeftNode: {
                    FieldType: 'Integer',
                    ApiName: 'Hi',
                    Operation: 'IsEqual',
                    Values: ['123'],
                },
                RightNode: {
                    FieldType: 'Integer',
                    ApiName: 'Bear',
                    Operation: '<',
                    Values: ['3'],
                },
            });
        });
        it('3 filters', function () {
            expect(
                concat(
                    true,
                    {
                        FieldType: 'Integer',
                        ApiName: 'Hi',
                        Operation: 'IsEqual',
                        Values: ['123'],
                    },
                    {
                        FieldType: 'Integer',
                        ApiName: 'Bear',
                        Operation: '<',
                        Values: ['3'],
                    },
                    {
                        FieldType: 'String',
                        ApiName: 'Deer',
                        Operation: 'Contains',
                        Values: ['rabbit'],
                    },
                ),
            ).to.be.deep.equal({
                Operation: 'AND',
                LeftNode: {
                    Operation: 'AND',
                    LeftNode: {
                        FieldType: 'Integer',
                        ApiName: 'Hi',
                        Operation: 'IsEqual',
                        Values: ['123'],
                    },
                    RightNode: {
                        FieldType: 'Integer',
                        ApiName: 'Bear',
                        Operation: '<',
                        Values: ['3'],
                    },
                },
                RightNode: {
                    FieldType: 'String',
                    ApiName: 'Deer',
                    Operation: 'Contains',
                    Values: ['rabbit'],
                },
            });
        });
        it('3 filters - 1 undefined', function () {
            expect(
                concat(
                    true,
                    {
                        FieldType: 'Integer',
                        ApiName: 'Hi',
                        Operation: 'IsEqual',
                        Values: ['123'],
                    },
                    undefined,
                    {
                        FieldType: 'String',
                        ApiName: 'Deer',
                        Operation: 'Contains',
                        Values: ['rabbit'],
                    },
                ),
            ).to.be.deep.equal({
                Operation: 'AND',
                LeftNode: {
                    FieldType: 'Integer',
                    ApiName: 'Hi',
                    Operation: 'IsEqual',
                    Values: ['123'],
                },
                RightNode: {
                    FieldType: 'String',
                    ApiName: 'Deer',
                    Operation: 'Contains',
                    Values: ['rabbit'],
                },
            });
        });
    });

    describe('OR', function () {
        it('1 filters', function () {
            expect(
                concat(false, {
                    FieldType: 'Integer',
                    ApiName: 'Hi',
                    Operation: 'IsEqual',
                    Values: ['123'],
                }),
            ).to.be.deep.equal({
                FieldType: 'Integer',
                ApiName: 'Hi',
                Operation: 'IsEqual',
                Values: ['123'],
            });
        });
        it('2 filters', function () {
            expect(
                concat(
                    false,
                    {
                        FieldType: 'Integer',
                        ApiName: 'Hi',
                        Operation: 'IsEqual',
                        Values: ['123'],
                    },
                    {
                        FieldType: 'Integer',
                        ApiName: 'Bear',
                        Operation: '<',
                        Values: ['3'],
                    },
                ),
            ).to.be.deep.equal({
                Operation: 'OR',
                LeftNode: {
                    FieldType: 'Integer',
                    ApiName: 'Hi',
                    Operation: 'IsEqual',
                    Values: ['123'],
                },
                RightNode: {
                    FieldType: 'Integer',
                    ApiName: 'Bear',
                    Operation: '<',
                    Values: ['3'],
                },
            });
        });
        it('3 filters', function () {
            expect(
                concat(
                    false,
                    {
                        FieldType: 'Integer',
                        ApiName: 'Hi',
                        Operation: 'IsEqual',
                        Values: ['123'],
                    },
                    {
                        FieldType: 'Integer',
                        ApiName: 'Bear',
                        Operation: '<',
                        Values: ['3'],
                    },
                    {
                        FieldType: 'String',
                        ApiName: 'Deer',
                        Operation: 'Contains',
                        Values: ['rabbit'],
                    },
                ),
            ).to.be.deep.equal({
                Operation: 'OR',
                LeftNode: {
                    Operation: 'OR',
                    LeftNode: {
                        FieldType: 'Integer',
                        ApiName: 'Hi',
                        Operation: 'IsEqual',
                        Values: ['123'],
                    },
                    RightNode: {
                        FieldType: 'Integer',
                        ApiName: 'Bear',
                        Operation: '<',
                        Values: ['3'],
                    },
                },
                RightNode: {
                    FieldType: 'String',
                    ApiName: 'Deer',
                    Operation: 'Contains',
                    Values: ['rabbit'],
                },
            });
        });
        it('3 filters - 1 undefined', function () {
            expect(
                concat(
                    false,
                    {
                        FieldType: 'Integer',
                        ApiName: 'Hi',
                        Operation: 'IsEqual',
                        Values: ['123'],
                    },
                    undefined,
                    {
                        FieldType: 'String',
                        ApiName: 'Deer',
                        Operation: 'Contains',
                        Values: ['rabbit'],
                    },
                ),
            ).to.be.deep.equal({
                Operation: 'OR',
                LeftNode: {
                    FieldType: 'Integer',
                    ApiName: 'Hi',
                    Operation: 'IsEqual',
                    Values: ['123'],
                },
                RightNode: {
                    FieldType: 'String',
                    ApiName: 'Deer',
                    Operation: 'Contains',
                    Values: ['rabbit'],
                },
            });
        });
    });

    describe('Mixed', function () {
        it('3 filters', function () {
            expect(
                concat(
                    true,
                    {
                        FieldType: 'String',
                        ApiName: 'Deer',
                        Operation: 'Contains',
                        Values: ['rabbit'],
                    },
                    concat(
                        false,
                        {
                            FieldType: 'Integer',
                            ApiName: 'Hi',
                            Operation: 'IsEqual',
                            Values: ['123'],
                        },
                        {
                            FieldType: 'Integer',
                            ApiName: 'Bear',
                            Operation: '<',
                            Values: ['3'],
                        },
                    ),
                ),
            ).to.be.deep.equal({
                Operation: 'AND',
                LeftNode: {
                    FieldType: 'String',
                    ApiName: 'Deer',
                    Operation: 'Contains',
                    Values: ['rabbit'],
                },
                RightNode: {
                    Operation: 'OR',
                    LeftNode: {
                        FieldType: 'Integer',
                        ApiName: 'Hi',
                        Operation: 'IsEqual',
                        Values: ['123'],
                    },
                    RightNode: {
                        FieldType: 'Integer',
                        ApiName: 'Bear',
                        Operation: '<',
                        Values: ['3'],
                    },
                },
            });
        });
    });
});
