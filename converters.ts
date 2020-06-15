export function str2Bool(str: string): boolean {
    return str !== undefined && (str == '1' || str.toLowerCase() === 'true');
}
