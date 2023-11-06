export declare const SchemeFieldTypes: readonly [
    'String',
    'MultipleStringValues',
    'Bool',
    'Integer',
    'Double',
    'Object',
    'Array',
    'DateTime',
    'Resource',
    'ContainedResource',
    'DynamicResource',
    'ContainedDynamicResource',
];
export declare type SchemeFieldType = (typeof SchemeFieldTypes)[number];

export function capitalizeFirstLetter(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}
