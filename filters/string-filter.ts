import Filter from "./filter";
import { StringOperation } from "../json-filter";

export class StringFilter extends Filter {
    
    constructor(
        apiName: string,
        private operation: StringOperation, 
        private filterValues: string[], 
        private caseSensitive: boolean = true
        ) {
        super(apiName);
    }

    apply(value: any): boolean {
        // anything that isn't a string is considered to be an empty value
        let stringVal = typeof value === 'string' ? value : '';
        
        switch (this.operation) {
            case 'IsEmpty':
                return stringVal === '';
            case 'IsNotEmpty':
                return stringVal !== '';
            case 'IsEqual':
                return this.compare(stringVal);
            case 'IsNotEqual':
                return !this.compare(stringVal);
            case 'Contains': 
                return stringVal.toLocaleLowerCase().includes(this.filterValues[0].toLocaleLowerCase());
            case 'StartWith':
                return stringVal.toLocaleLowerCase().startsWith(this.filterValues[0].toLocaleLowerCase());
            case 'EndWith':
                return stringVal.toLocaleLowerCase().endsWith(this.filterValues[0].toLocaleLowerCase());
            case 'IsLoggedInUser':
                throw new Error('IsLoggedInUser isn\'t a supported filter');
        }
    }
    
    toSQLWhereClause(): string {
        switch (this.operation) {
            case 'IsEmpty':
                return `${this.apiName} IS NULL OR ${this.apiName} = ''`;
            case 'IsNotEmpty':
                return `${this.apiName} IS NOT NULL AND ${this.apiName} != ''`;
            case 'IsEqual':
                return `${this.apiName} IN (${this.filterValues.map(str => `'${str}'`).join(', ')})`;
            case 'IsNotEqual':
                return `${this.apiName} NOT IN (${this.filterValues.map(str => `'${str}'`).join(', ')})`;
            case 'Contains': 
                return `${this.apiName} LIKE '%${this.filterValues[0]}%'`;
            case 'StartWith':
                return `${this.apiName} LIKE '${this.filterValues[0]}%'`;
            case 'EndWith':
                return `${this.apiName} LIKE '%${this.filterValues[0]}'`;
            case 'IsLoggedInUser':
                throw new Error('IsLoggedInUser isn\'t a supported filter');
        }
    }

    private compare(value: string): boolean {
        if (typeof value !== 'string') {
            return false;
        }

        const first = this.filterValues.find(str => { 
            return str.localeCompare(value, undefined, { 
                sensitivity: this.caseSensitive ? 'case' : 'base' 
            }) === 0;
        });
        return first != undefined;
    }
}