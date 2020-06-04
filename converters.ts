export function str2Bool(str: string) {
    return str !== undefined && (str == '1' || str.toLowerCase() === 'true');
}