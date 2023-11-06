import {
    DateOperation,
    JSONDateFilter,
    JSONDoubleFilter,
    JSONIntegerFilter,
    JSONStringFilter,
    NumberOperation,
    StringOperation,
} from '../../json-filter';
import { IPepSmartFilterData } from '../json-to-ngx';
import { capitalizeFirstLetter } from './metadata';

export class NgxToJsonNumberFilterBuilder {
    static build(filter: IPepSmartFilterData, type: 'Integer' | 'Double'): JSONIntegerFilter | JSONDoubleFilter {
        let operation: NumberOperation;
        switch (filter.operator.id) {
            case 'eq':
                operation = '=';
                break;
            case 'neq':
                operation = '!=';
                break;
            case 'lt':
                operation = '<';
                break;
            case 'gt':
                operation = '>';
                break;
            case 'numberRange':
                operation = 'Between';
                break;
            default:
                throw Error(`in to json number filter: operator ${filter.operator.id} is not supported`);
        }
        return {
            ApiName: filter.fieldId,
            Operation: operation,
            FieldType: type,
            Values: Object.values(filter.value),
        };
    }
}

export class NgxToJsonStringFilterBuilder {
    static build(filter: IPepSmartFilterData): JSONStringFilter {
        let operation: StringOperation;
        switch (filter.operator.id) {
            case 'contains':
                operation = 'Contains';
                break;
            case 'beginsWith':
                operation = 'StartWith';
                break;
            case 'endsWith':
                operation = 'EndWith';
                break;
            case 'eq':
                operation = 'IsEqual';
                break;
            case 'neq':
                operation = 'IsNotEqual';
                break;
            case 'in':
                operation = 'In';
                break;
            default:
                throw Error(`in to json string filter: operator ${filter.operator.id} is not supported`);
        }
        return {
            ApiName: filter.fieldId,
            Operation: operation!,
            FieldType: 'String',
            Values: Object.values(filter.value),
        };
    }
}

export class NgxToJsonDateFilterBuilder {
    static build(filter: IPepSmartFilterData): JSONDateFilter {
        let operation: DateOperation;
        const values: string[] = [];
        switch (filter.operator.id) {
            case 'dateRange':
                operation = 'Between';
                break;
            case 'inTheLast':
                values.push(capitalizeFirstLetter(filter.operatorUnit!.id));
                operation = 'InTheLast';
                break;
            case 'today':
                operation = 'Today';
                break;
            case 'thisWeek':
                operation = 'ThisWeek';
                break;
            case 'thisMonth':
                operation = 'ThisMonth';
                break;
            case 'dueIn':
                operation = 'DueIn';
                values.push(capitalizeFirstLetter(filter.operatorUnit!.id));
                break;
            case 'on':
                operation = 'On';
            case 'notInTheLast':
                operation = 'NotInTheLast';
                values.push(capitalizeFirstLetter(filter.operatorUnit!.id));
                break;
            case 'notDueIn':
                operation = 'NotDueIn';
                values.push(capitalizeFirstLetter(filter.operatorUnit!.id));
                break;
            case 'isEmpty':
                operation = 'IsEmpty';
                break;
            case 'isNotEmpty':
                operation = 'IsNotEmpty';
                break;
            default:
                throw Error(`date filter: operation ${filter.operator.id} is not supported`);
        }
        return {
            ApiName: filter.fieldId,
            Operation: operation,
            FieldType: 'Date',
            Values: Object.values(filter.value),
        };
    }
}
