import { JSONRegularFilter } from "../json-filter";
import { IPepSmartFilterData, IPepSmartFilterDataValue, IPepSmartFilterOperator, IPepSmartFilterOperatorUnit, PepSmartFilterOperatorUnitType } from "./ngx-types";

export abstract class NGXFilterOperation implements IPepSmartFilterData{
    fieldId: string;
    operator!: IPepSmartFilterOperator;
    operatorUnit?: IPepSmartFilterOperatorUnit;
    value: IPepSmartFilterDataValue;

    constructor(filter: JSONRegularFilter){
        this.fieldId = filter.ApiName
        this.value = {first: null}
    }
}

export class NGXFilterIsEqualOperation extends NGXFilterOperation{
    constructor(filter: JSONRegularFilter){
        super(filter)
        this.operator = {
            componentType: ['number', 'boolean', 'text'],
            id: 'eq',
            name: "EQUAL",
            short: "="
        }
        this.value = {first: filter.Values[0]}
    }
}

export class NGXFilterNotEqualOperation extends NGXFilterOperation{
    constructor(filter: JSONRegularFilter){
        super(filter)
        this.operator = {
            componentType: ['number', 'text'],
            id: 'neq',
            name: "NOT_EQUAL",
            short: "<>"
        }
        this.value = {first: filter.Values[0]}
    }
}

export class NGXFilterLessThanOperation extends NGXFilterOperation{
    constructor(filter: JSONRegularFilter){
        super(filter)
        this.operator = {
            componentType: ['number'],
            id: 'lt',
            name: "LESS_THEN",
            short: "<"
        }
        this.value = {first: filter.Values[0]}
    }
}

export class NGXFilterGreaterThanOperation extends NGXFilterOperation{
    constructor(filter: JSONRegularFilter){
        super(filter)
        this.operator = {
            componentType: ['number'],
            id: 'gt',
            name: "GREATER_THEN",
            short: ">"
        }
        this.value = {first: filter.Values[0]}
    }
}

export class NGXFilterNumberRangeOperation extends NGXFilterOperation{
    constructor(filter: JSONRegularFilter){
        super(filter)
        this.operator = {
            componentType: ['number'],
            id: 'numberRange',
            name: "NUMBER_RANGE",
            short: "Range"
        }
        this.value = {first: filter.Values[0], second: filter.Values[1]}
    }
}

export class NGXFilterContainsOperation extends NGXFilterOperation{
    constructor(filter: JSONRegularFilter){
        super(filter)
        this.operator = {
            componentType: ['text'],
            id: 'contains',
            name: "CONTAINS",
            short: "Contains"
        }
        this.value = {first: filter.Values[0]}
    }
}

export class NGXFilterBeginsWithOperation extends NGXFilterOperation{
    constructor(filter: JSONRegularFilter){
        super(filter)
        this.operator = {
            componentType: ['text'],
            id: 'beginsWith',
            name: "BEGINS_WITH",
            short: "Begins With"
        }
        this.value = {first: filter.Values[0]}
    }
}

export class NGXFilterEndsWithOperation extends NGXFilterOperation{
    constructor(filter: JSONRegularFilter){
        super(filter)
        this.operator = {
            componentType: ['text'],
            id: 'endsWith',
            name: "ENDS_WITH",
            short: "Ends With"
        }
        this.value = {first: filter.Values[0]}
    }
}

export class  NGXFilterInTheLastOperation extends NGXFilterOperation{
    constructor(filter: JSONRegularFilter){
        super(filter)
        
        this.operator = {
            componentType: ['date'],
            id: 'inTheLast',
            name: "IN_THE_LAST",
            short: "In the last"
        }
        this.operatorUnit = {
            componentType: ['date'],
            id: filter.Values[1].toLowerCase() as PepSmartFilterOperatorUnitType,
            name: filter.Values[1].toUpperCase()
        }
        this.value = {first: filter.Values[0]}
    }
}

export class NGXFilterDateRangeOperation extends NGXFilterOperation{
    constructor(filter: JSONRegularFilter){
        super(filter)
        this.operator = {
            componentType: ['date'],
            id: "dateRange",
            name: "DATE_RANGE",
            short: "Range"
        }
        this.value = {first: filter.Values[0], second: filter.Values[1]}
    }
}

export class NGXFilterTodayOperation extends NGXFilterOperation{
    constructor(filter: JSONRegularFilter){
        super(filter)
        this.operator = {
            componentType: ['date'],
            id: "today",
            name: "TODAY",
            short: "Today"
        }
    }
}

export class NGXFilterThisWeekOperation extends NGXFilterOperation{
    constructor(filter: JSONRegularFilter){
        super(filter)
        this.operator = {
            componentType: ['date'],
            id: "thisWeek",
            name: "THIS_WEEK",
            short: "This week"
        }
    }
}

export class NGXFilterThisMonthOperation extends NGXFilterOperation{
    constructor(filter: JSONRegularFilter){
        super(filter)
        this.operator = {
            componentType: ['date'],
            id: "thisMonth",
            name: "THIS_MONTH",
            short: "This month"
        }
    }
}

export class NGXFilterIsEmptyOperation extends NGXFilterOperation{
    constructor(filter: JSONRegularFilter){
        super(filter)
        this.operator = {
            componentType: ['date'],
            id: "isEmpty",
            name: "IS_EMPTY",
            short: "Is empty"
        }
    }
}

export class NGXFilterIsNotEmptyOperation extends NGXFilterOperation{
    constructor(filter: JSONRegularFilter){
        super(filter)
        this.operator = {
            componentType: ['date'],
            id: "isNotEmpty",
            name: "IS_NOT_EMPTY",
            short: "Is not empty"
        }
    }
}

export class NGXFilterOnOperation extends NGXFilterOperation{
    constructor(filter: JSONRegularFilter){
        super(filter)
        this.operator = {
            componentType: ['date'],
            id: "on",
            name: "ON",
            short: "On"
        }
        this.value = {first: filter.Values[0]}
    }
}


export class NGXFilterDueInOperation extends NGXFilterOperation{
    constructor(filter: JSONRegularFilter){
        super(filter)
        this.operator = {
            componentType: ['date'],
            id: "dueIn",
            name: "DUE_IN",
            short: "Due In"
        }
        this.operatorUnit = {
            componentType: ['date'],
            id: filter.Values[1].toLowerCase() as PepSmartFilterOperatorUnitType,
            name: filter.Values[1].toUpperCase()
        }
        this.value = {first: filter.Values[0]}
    }
}

export class NGXFilterNotDueInOperation extends NGXFilterOperation{
    constructor(filter: JSONRegularFilter){
        super(filter)
        this.operator = {
            componentType: ['date'],
            id: "notDueIn",
            name: "NOT_DUE_IN",
            short: "Not due In"
        }
        this.operatorUnit = {
            componentType: ['date'],
            id: filter.Values[1].toLowerCase() as PepSmartFilterOperatorUnitType,
            name: filter.Values[1].toUpperCase()
        }
        this.value = {first: filter.Values[0]}
    }
}

export class NGXFilterBetweenOperationFactory{

    static create(filter: JSONRegularFilter){
        if(filter.Operation != "Between"){
            throw Error(`error in NGXFilterBetweenOperationFactory, operation of type ${filter.Operation} is not supported`)
        }
        switch(filter.FieldType){
            case "Integer":
            case "Double":
                return new NGXFilterNumberRangeOperation(filter)
            case "Date":
                return new NGXFilterDateRangeOperation(filter)
            default:
                throw Error(`ngx filter between operation factory - ${filter.Operation} is not supported`)
        }
    }
}