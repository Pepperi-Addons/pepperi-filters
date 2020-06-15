import { JSONFilter } from './index';

export function str2Bool(str: string): boolean {
    return str !== undefined && (str == '1' || str.toLowerCase() === 'true');
}

export function combineJSONFilters(
    f1: JSONFilter | undefined,
    f2: JSONFilter | undefined,
    and: boolean,
): JSONFilter | undefined {
    if (f1 && f2) {
        return {
            Operation: and ? 'AND' : 'OR',
            LeftNode: f1,
            RightNode: f2,
        };
    }
    return f1 || f2;
}

export function combineWhereClauses(s1: string | undefined, s2: string | undefined, and: boolean): string {
    if (s1 && s2) {
        return `(${s1} ${and ? 'AND' : 'OR'} ${s2})`;
    }
    return s1 || s2 || '';
}
