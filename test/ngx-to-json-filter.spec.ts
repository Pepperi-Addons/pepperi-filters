import 'mocha';
import { expect } from 'chai';
import { IPepSmartFilterData } from '../ngx-filters/json-to-ngx/ngx-types';
import { SchemeFieldType } from '../ngx-filters/ngx-to-json/metadata';
import { JSONDoubleFilter, JSONIntegerFilter, JSONRegularFilter, JSONStringFilter } from '../json-filter';
import { ngxFilterToJsonFilter, concat } from '../index';

describe('NGX Filters To JSON Filters', () => {
    describe('1. Integer Filters', () => {
        const type: SchemeFieldType = 'Integer';
        const ngxIntegerFilters: IPepSmartFilterData[] = [
            {
                fieldId: 'equal to 1',
                operator: {
                    id: 'eq',
                    name: 'EQUAL',
                    short: '=',
                    componentType: ['number', 'boolean', 'text'],
                },
                value: { first: '1' },
            },
            {
                fieldId: 'equal to 2',
                operator: {
                    id: 'eq',
                    name: 'EQUAL',
                    short: '=',
                    componentType: ['number', 'boolean', 'text'],
                },
                value: { first: '2' },
            },
            {
                fieldId: 'not equal to 1',
                operator: {
                    id: 'neq',
                    name: 'NOT_EQUAL',
                    short: '<>',
                    componentType: ['number', 'text'],
                },
                value: { first: '1' },
            },
            {
                fieldId: 'not equal to 2',
                operator: {
                    id: 'neq',
                    name: 'NOT_EQUAL',
                    short: '<>',
                    componentType: ['number', 'text'],
                },
                value: { first: '2' },
            },
            {
                fieldId: 'less than 1',
                operator: {
                    id: 'lt',
                    name: 'LESS_THEN',
                    short: '<',
                    componentType: ['number'],
                },
                value: { first: '1' },
            },
            {
                fieldId: 'less than 2',
                operator: {
                    id: 'lt',
                    name: 'LESS_THEN',
                    short: '<',
                    componentType: ['number'],
                },
                value: { first: '2' },
            },
            {
                fieldId: 'greater than 1',
                operator: {
                    id: 'gt',
                    name: 'GREATER_THEN',
                    short: '>',
                    componentType: ['number'],
                },
                value: { first: '1' },
            },
            {
                fieldId: 'greater than 2',
                operator: {
                    id: 'gt',
                    name: 'GREATER_THEN',
                    short: '>',
                    componentType: ['number'],
                },
                value: { first: '2' },
            },
        ];

        const expectedResults: JSONIntegerFilter[] = [
            {
                FieldType: 'Integer',
                ApiName: 'equal to 1',
                Operation: '=',
                Values: ['1'],
            },
            {
                FieldType: 'Integer',
                ApiName: 'equal to 2',
                Operation: '=',
                Values: ['2'],
            },
            {
                FieldType: 'Integer',
                ApiName: 'not equal to 1',
                Operation: '!=',
                Values: ['1'],
            },
            {
                FieldType: 'Integer',
                ApiName: 'not equal to 2',
                Operation: '!=',
                Values: ['2'],
            },
            {
                FieldType: 'Integer',
                ApiName: 'less than 1',
                Operation: '<',
                Values: ['1'],
            },
            {
                FieldType: 'Integer',
                ApiName: 'less than 2',
                Operation: '<',
                Values: ['2'],
            },
            {
                FieldType: 'Integer',
                ApiName: 'greater than 1',
                Operation: '>',
                Values: ['1'],
            },
            {
                FieldType: 'Integer',
                ApiName: 'greater than 2',
                Operation: '>',
                Values: ['2'],
            },
        ];
        ngxIntegerFilters.forEach((ngxFilter, index) => {
            it(`${index + 1}. ${ngxFilter.fieldId} test `, getNGXFilterTestCB(ngxFilter, expectedResults[index], type));
        });
    });
    describe('2. Double Filters', () => {
        const type: SchemeFieldType = 'Double';
        const ngxIntegerFilters: IPepSmartFilterData[] = [
            {
                fieldId: 'equal to 1',
                operator: {
                    id: 'eq',
                    name: 'EQUAL',
                    short: '=',
                    componentType: ['number', 'boolean', 'text'],
                },
                value: { first: '1' },
            },
            {
                fieldId: 'equal to 2',
                operator: {
                    id: 'eq',
                    name: 'EQUAL',
                    short: '=',
                    componentType: ['number', 'boolean', 'text'],
                },
                value: { first: '2' },
            },
            {
                fieldId: 'not equal to 1',
                operator: {
                    id: 'neq',
                    name: 'NOT_EQUAL',
                    short: '<>',
                    componentType: ['number', 'text'],
                },
                value: { first: '1' },
            },
            {
                fieldId: 'not equal to 2',
                operator: {
                    id: 'neq',
                    name: 'NOT_EQUAL',
                    short: '<>',
                    componentType: ['number', 'text'],
                },
                value: { first: '2' },
            },
            {
                fieldId: 'less than 1',
                operator: {
                    id: 'lt',
                    name: 'LESS_THEN',
                    short: '<',
                    componentType: ['number'],
                },
                value: { first: '1' },
            },
            {
                fieldId: 'less than 2',
                operator: {
                    id: 'lt',
                    name: 'LESS_THEN',
                    short: '<',
                    componentType: ['number'],
                },
                value: { first: '2' },
            },
            {
                fieldId: 'greater than 1',
                operator: {
                    id: 'gt',
                    name: 'GREATER_THEN',
                    short: '>',
                    componentType: ['number'],
                },
                value: { first: '1' },
            },
            {
                fieldId: 'greater than 2',
                operator: {
                    id: 'gt',
                    name: 'GREATER_THEN',
                    short: '>',
                    componentType: ['number'],
                },
                value: { first: '2' },
            },
        ];

        const expectedResults: JSONDoubleFilter[] = [
            {
                FieldType: 'Double',
                ApiName: 'equal to 1',
                Operation: '=',
                Values: ['1'],
            },
            {
                FieldType: 'Double',
                ApiName: 'equal to 2',
                Operation: '=',
                Values: ['2'],
            },
            {
                FieldType: 'Double',
                ApiName: 'not equal to 1',
                Operation: '!=',
                Values: ['1'],
            },
            {
                FieldType: 'Double',
                ApiName: 'not equal to 2',
                Operation: '!=',
                Values: ['2'],
            },
            {
                FieldType: 'Double',
                ApiName: 'less than 1',
                Operation: '<',
                Values: ['1'],
            },
            {
                FieldType: 'Double',
                ApiName: 'less than 2',
                Operation: '<',
                Values: ['2'],
            },
            {
                FieldType: 'Double',
                ApiName: 'greater than 1',
                Operation: '>',
                Values: ['1'],
            },
            {
                FieldType: 'Double',
                ApiName: 'greater than 2',
                Operation: '>',
                Values: ['2'],
            },
        ];
        ngxIntegerFilters.forEach((ngxFilter, index) => {
            it(`${index + 1}. ${ngxFilter.fieldId} test `, getNGXFilterTestCB(ngxFilter, expectedResults[index], type));
        });
    });
    describe('3. String Filters', () => {
        const type: SchemeFieldType = 'String';
        const ngxStringFilters: IPepSmartFilterData[] = [
            {
                fieldId: 'equal to A',
                operator: {
                    id: 'eq',
                    name: 'EQUAL',
                    short: '=',
                    componentType: ['number', 'boolean', 'text'],
                },
                value: { first: 'A' },
            },
            {
                fieldId: 'equal to B',
                operator: {
                    id: 'eq',
                    name: 'EQUAL',
                    short: '=',
                    componentType: ['number', 'boolean', 'text'],
                },
                value: { first: 'B' },
            },
            {
                fieldId: 'not equal to A',
                operator: {
                    id: 'neq',
                    name: 'NOT_EQUAL',
                    short: '<>',
                    componentType: ['number', 'text'],
                },
                value: { first: 'A' },
            },
            {
                fieldId: 'not equal to B',
                operator: {
                    id: 'neq',
                    name: 'NOT_EQUAL',
                    short: '<>',
                    componentType: ['number', 'text'],
                },
                value: { first: 'B' },
            },
            {
                fieldId: 'contains A',
                operator: {
                    id: 'contains',
                    name: 'CONTAINS',
                    short: 'Contains',
                    componentType: ['text'],
                },
                value: { first: 'A' },
            },
            {
                fieldId: 'contains B',
                operator: {
                    id: 'contains',
                    name: 'CONTAINS',
                    short: 'Contains',
                    componentType: ['text'],
                },
                value: { first: 'B' },
            },
            {
                fieldId: 'begins with A',
                operator: {
                    id: 'beginsWith',
                    name: 'BEGINS_WITH',
                    short: 'Begins With',
                    componentType: ['text'],
                },
                value: { first: 'A' },
            },
            {
                fieldId: 'begins with B',
                operator: {
                    id: 'beginsWith',
                    name: 'BEGINS_WITH',
                    short: 'Begins With',
                    componentType: ['text'],
                },
                value: { first: 'B' },
            },
            {
                fieldId: 'ends with A',
                operator: {
                    id: 'endsWith',
                    name: 'ENDS_WITH',
                    short: 'Ends With',
                    componentType: ['text'],
                },
                value: { first: 'A' },
            },
            {
                fieldId: 'ends with B',
                operator: {
                    id: 'endsWith',
                    name: 'ENDS_WITH',
                    short: 'Ends With',
                    componentType: ['text'],
                },
                value: { first: 'B' },
            },
            {
                fieldId: 'in ["A","B","C"]',
                operator: {
                    id: 'in',
                    name: 'IN',
                    short: 'In',
                    componentType: ['multi-select'],
                },
                value: { first: ['A', 'B', 'C'] },
            },
        ];

        const expectedResults: JSONStringFilter[] = [
            {
                FieldType: 'String',
                ApiName: 'equal to A',
                Operation: 'IsEqual',
                Values: ['A'],
            },
            {
                FieldType: 'String',
                ApiName: 'equal to B',
                Operation: 'IsEqual',
                Values: ['B'],
            },
            {
                FieldType: 'String',
                ApiName: 'not equal to A',
                Operation: 'IsNotEqual',
                Values: ['A'],
            },
            {
                FieldType: 'String',
                ApiName: 'not equal to B',
                Operation: 'IsNotEqual',
                Values: ['B'],
            },
            {
                FieldType: 'String',
                ApiName: 'contains A',
                Operation: 'Contains',
                Values: ['A'],
            },
            {
                FieldType: 'String',
                ApiName: 'contains B',
                Operation: 'Contains',
                Values: ['B'],
            },
            {
                FieldType: 'String',
                ApiName: 'begins with A',
                Operation: 'StartWith',
                Values: ['A'],
            },
            {
                FieldType: 'String',
                ApiName: 'begins with B',
                Operation: 'StartWith',
                Values: ['B'],
            },
            {
                FieldType: 'String',
                ApiName: 'ends with A',
                Operation: 'EndWith',
                Values: ['A'],
            },
            {
                FieldType: 'String',
                ApiName: 'ends with B',
                Operation: 'EndWith',
                Values: ['B'],
            },
            {
                FieldType: 'String',
                ApiName: 'in ["A","B","C"]',
                Operation: 'IsEqual',
                Values: ['A', 'B', 'C'],
            },
        ];
        ngxStringFilters.forEach((ngxFilter, index) => {
            it(`${index + 1}. ${ngxFilter.fieldId} test `, getNGXFilterTestCB(ngxFilter, expectedResults[index], type));
        });
    });
    describe('3. NGX Array Filters To Complex JSON Filter', () => {
        it(`json filter array with one element`, () => {
            const jsonFiltersArray: IPepSmartFilterData[] = [
                {
                    fieldId: 'equalToA',
                    operator: {
                        id: 'eq',
                        name: 'EQUAL',
                        short: '=',
                        componentType: ['number', 'boolean', 'text'],
                    },
                    value: { first: 'A' },
                },
            ];
            const expectedResult: JSONStringFilter = {
                ApiName: 'equalToA',
                FieldType: 'String',
                Operation: 'IsEqual',
                Values: ['A'],
            };
            const result = ngxFilterToJsonFilter(jsonFiltersArray, { equalToA: 'String' });
            expect(result).to.be.eql(expectedResult);
        });
        it(`json filter array with zero elements`, () => {
            const jsonFiltersArray: IPepSmartFilterData[] = [];
            const expectedResult = undefined;
            const result = ngxFilterToJsonFilter(jsonFiltersArray, {});
            expect(result).to.be.eql(expectedResult);
        });
        it(`json filter array with two elements`, () => {
            const jsonFiltersArray: IPepSmartFilterData[] = [
                {
                    fieldId: 'equalToA',
                    operator: {
                        id: 'eq',
                        name: 'EQUAL',
                        short: '=',
                        componentType: ['number', 'boolean', 'text'],
                    },
                    value: { first: 'A' },
                },
                {
                    fieldId: 'equalToB',
                    operator: {
                        id: 'eq',
                        name: 'EQUAL',
                        short: '=',
                        componentType: ['number', 'boolean', 'text'],
                    },
                    value: { first: 'B' },
                },
            ];
            const firstFilter: JSONStringFilter = {
                ApiName: 'equalToA',
                FieldType: 'String',
                Operation: 'IsEqual',
                Values: ['A'],
            };
            const secondFilter: JSONStringFilter = {
                ApiName: 'equalToB',
                FieldType: 'String',
                Operation: 'IsEqual',
                Values: ['B'],
            };
            //the test will fail if the json complex filters nodes will not be in the same order as in the expected result
            const expectedResult = concat(true, secondFilter, firstFilter);
            const result = ngxFilterToJsonFilter(jsonFiltersArray, { equalToA: 'String', equalToB: 'String' });
            expect(result).to.be.eql(expectedResult);
        });
    });
});

function getNGXFilterTestCB(filter1: IPepSmartFilterData, filter2: JSONRegularFilter, type: SchemeFieldType) {
    return () => expect(ngxFilterToJsonFilter(filter1, { [filter2.ApiName]: type })).to.be.eql(filter2);
}
