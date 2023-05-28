export interface IPepSmartFilterData {
    fieldId: string;
    operator: IPepSmartFilterOperator;
    operatorUnit?: IPepSmartFilterOperatorUnit;
    value: IPepSmartFilterDataValue;
}

export interface IPepSmartFilterDataValue {
    first: any;
    second?: any;
}

export declare class IPepSmartFilterOperator {
    id: PepSmartFilterOperatorType;
    name: string;
    short: string;
    componentType: PepSmartFilterComponentType[];
}

export declare class IPepSmartFilterOperatorUnit {
    id: PepSmartFilterOperatorUnitType;
    name: string;
    componentType: PepSmartFilterComponentType[];
}

export declare type PepSmartFilterComponentType = 'text' | 'number' | 'date' | 'multi-select' | 'boolean';
export declare type PepSmartFilterOperatorUnitType = 'days' | 'weeks' | 'months' | 'years';
export declare type PepSmartFilterOperatorType =
    | 'eq'
    | 'eqv'
    | 'neq'
    | 'neqv'
    | 'lt'
    | 'ltv'
    | 'gt'
    | 'gtv'
    | 'ltoe'
    | 'gtoe'
    | 'numberRange'
    | 'contains'
    | 'beginsWith'
    | 'endsWith'
    | 'after'
    | 'before'
    | 'inTheLast'
    | 'inTheLastCalendar'
    | 'today'
    | 'thisWeek'
    | 'thisMonth'
    | 'dateRange'
    | 'dateRangeVariable'
    | 'dueIn'
    | 'on'
    | 'notInTheLast'
    | 'notInTheLastCalendar'
    | 'notDueIn'
    | 'isEmpty'
    | 'isNotEmpty'
    | 'in';
