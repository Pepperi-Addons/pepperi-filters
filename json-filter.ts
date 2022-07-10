export type BasicOperations = 'IsEmpty' | 'IsNotEmpty' | 'IsEqual' | 'IsEqualVariable' | 'IsNotEqual';

export type NumberOperation =
    | BasicOperations
    | '='
    | '>'
    | '>='
    | '<'
    | '<='
    | '!='
    | 'Between'
    | 'LessThanVarible'
    | 'GreaterThanVarible';

export type StringOperation = BasicOperations | 'Contains' | 'StartWith' | 'EndWith' | 'IsLoggedInUser';

export type DateOperation =
    | 'InTheLast'
    | 'InTheLastCalendar'
    | 'Today'
    | 'ThisWeek'
    | 'ThisMonth'
    | 'Before'
    | 'After'
    | 'Between'
    | 'BetweenVariable'
    | 'DueIn'
    | 'On'
    | 'NotInTheLast'
    | 'NotInTheLastCalendar'
    | 'NotDueIn'
    | 'IsEmpty'
    | 'IsNotEmpty'
    | '='
    | '!='
    | '>='
    | '>'
    | '<'
    | '<=';

export type JSONBoolOperation = 'IsEqual';

export type AnyOperation = NumberOperation | StringOperation | DateOperation;

export type TimeUnit = 'Days' | 'Weeks' | 'Months' | 'Years';

export type FieldType =
    | 'Bool'
    | 'JsonBool'
    | 'Integer'
    | 'Double'
    | 'String'
    | 'Date'
    | 'DateTime'
    | 'MultipleStringValues'
    | 'Guid';

export interface JSONComplexFilter {
    Operation: 'AND' | 'OR';
    RightNode: JSONFilter;
    LeftNode: JSONFilter;
}

export interface JSONBaseFilter {
    FieldType: FieldType;
    ApiName: string;
    Operation: AnyOperation;
    Values: string[];
}

export interface JSONBoolFilter extends JSONBaseFilter {
    FieldType: 'Bool';
}

export interface JSONJsonBoolFilter extends JSONBaseFilter {
    FieldType: 'JsonBool';
    Operation: JSONBoolOperation;
}

export interface JSONIntegerFilter extends JSONBaseFilter {
    FieldType: 'Integer';
    Operation: NumberOperation;
}

export interface JSONDoubleFilter extends JSONBaseFilter {
    FieldType: 'Double';
    Operation: NumberOperation;
}

export interface JSONStringFilter extends JSONBaseFilter {
    FieldType: 'String';
    Operation: StringOperation;
}

export interface JSONDateTimeFilter extends JSONBaseFilter {
    FieldType: 'DateTime';
    Operation: DateOperation;
}

export interface JSONDateFilter extends JSONBaseFilter {
    FieldType: 'Date';
    Operation: DateOperation;
}

export interface JSONMultipleStringValuesFilter extends JSONBaseFilter {
    FieldType: 'MultipleStringValues';
    Operation: BasicOperations;
}

export interface JSONGuidFilter extends JSONBaseFilter {
    FieldType: 'Guid';
    Operation: BasicOperations;
}

export type JSONRegularFilter =
    | JSONStringFilter
    | JSONBoolFilter
    | JSONJsonBoolFilter
    | JSONDateFilter
    | JSONDateTimeFilter
    | JSONGuidFilter
    | JSONMultipleStringValuesFilter
    | JSONIntegerFilter
    | JSONDoubleFilter;

export type JSONFilter = JSONComplexFilter | JSONRegularFilter;
