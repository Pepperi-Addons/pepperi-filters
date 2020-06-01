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
        let stringVal = value ? value.toString() : '';
        switch (this.operation) {
            case 'IsEmpty':
                return value ? false : true;
            case 'IsNotEmpty':
                return value ? true : false;
            case 'IsEqual':
                return this.compare(stringVal);
            case 'IsNotEqual':
                return !this.compare(stringVal);
            case 'Contains': 
                return this.filterValues[0].toLocaleLowerCase().includes(stringVal.toLocaleLowerCase());
            case 'StartWith':
                return this.filterValues[0].toLocaleLowerCase().startsWith(stringVal.toLocaleLowerCase());
            case 'EndWith':
                return this.filterValues[0].toLocaleLowerCase().endsWith(stringVal.toLocaleLowerCase());
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
        const first = this.filterValues.find(str => { 
            return str.localeCompare(value, undefined, { 
                sensitivity: this.caseSensitive ? 'case' : 'base' 
            }) === 0;
        });
        return first != undefined;
    }

}