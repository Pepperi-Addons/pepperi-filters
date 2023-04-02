import 'mocha';
import { expect } from 'chai';
import { IPepSmartFilterData } from '../ngx-filters/json-to-ngx/ngx-types';
import { SchemeFieldType } from '../ngx-filters/ngx-to-json/metadata';
import { JSONIntegerFilter } from '../json-filter';
import { ngxFilterToJsonFilter } from '../index';

describe('ngx integers filter to json filters', () => {
    const type: SchemeFieldType = 'Integer'
    const ngxIntegerFilters: IPepSmartFilterData[] = [
        {
            fieldId: 'equalTo1',
            operator: {
                id: 'eq',
                name: 'EQUAL',
                short: "=",
                componentType: ["number", "boolean", "text"]
            },
            value: {first: '1'} 
        },
        {
            fieldId: 'equalTo2',
            operator: {
                id: 'eq',
                name: 'EQUAL',
                short: "=",
                componentType: ["number", "boolean", "text"]
            },
            value: {first: '2'} 
        },
        {
            fieldId: 'notEqualTo1',
            operator: {
                id: 'neq',
                name: 'NOT_EQUAL',
                short: "<>",
                componentType: ["number", "text"]
            },
            value: {first: '1'} 
        },
        {
            fieldId: 'notEqualTo2',
            operator: {
                id: 'neq',
                name: 'NOT_EQUAL',
                short: "<>",
                componentType: ["number", "text"]
            },
            value: {first: '2'} 
        },
        {
            fieldId: 'lessThan1',
            operator: {
                id: 'lt',
                name: 'LESS_THEN',
                short: "<",
                componentType: ["number"]
            },
            value: {first: '1'} 
        },
        {
            fieldId: 'lessThan2',
            operator: {
                id: 'lt',
                name: 'LESS_THEN',
                short: "<",
                componentType: ["number"]
            },
            value: {first: '2'} 
        },
        {
            fieldId: 'greaterThan1',
            operator: {
                id: 'gt',
                name: 'GREATER_THEN',
                short: ">",
                componentType: ["number"]
            },
            value: {first: '1'} 
        },
        {
            fieldId: 'greaterThan2',
            operator: {
                id: 'gt',
                name: 'GREATER_THEN',
                short: ">",
                componentType: ["number"]
            },
            value: {first: '2'} 
        },
    ]

    const expectedResults: JSONIntegerFilter[] = [
        {
            FieldType: 'Integer',
            ApiName: 'equalTo1',
            Operation: '=',
            Values: ['1']
        },
        {
            FieldType: 'Integer',
            ApiName: 'equalTo2',
            Operation: '=',
            Values: ['2']
        },
        {
            FieldType: 'Integer',
            ApiName: 'notEqualTo1',
            Operation: '!=',
            Values: ['1']
        },
        {
            FieldType: 'Integer',
            ApiName: 'notEqualTo2',
            Operation: '!=',
            Values: ['2']
        },
        {
            FieldType: 'Integer',
            ApiName: 'lessThan1',
            Operation: '<',
            Values: ['1']
        },
        {
            FieldType: 'Integer',
            ApiName: 'lessThan2',
            Operation: '<',
            Values: ['2']
        },
        {
            FieldType: 'Integer',
            ApiName: 'greaterThan1',
            Operation: '>',
            Values: ['1']
        },
        {
            FieldType: 'Integer',
            ApiName: 'greaterThan2',
            Operation: '>',
            Values: ['2']
        },
    ]

    ngxIntegerFilters.forEach((ngxFilter, index) => {
        it(`${index + 1}. ${ngxFilter.fieldId} test `, () => expect(ngxFilterToJsonFilter(ngxFilter, 'Integer')).to.be.eql(expectedResults[index]))
    })

});
