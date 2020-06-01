import Filter from "./filter";
import { NumberOperation } from "../json-filter";

export class NumberFilter extends Filter {
    
    constructor(
        apiName: string,
        private operation: NumberOperation,
        private filterValues: number[] = []
    ) {
        super(apiName);
    }

    apply(value: any): boolean {
        switch (this.operation) {
            case 'IsEmpty':
                return value == undefined;
            case 'IsNotEmpty':
                return value != undefined;
            case 'IsEqual':
                return this.filterValues.find(x => value === x) !== undefined;
            case 'IsNotEqual':
                return this.filterValues.find(x => value === x) === undefined;
            case '=': 
                return value === this.filterValues[0];
            case '!=': 
                return value !== this.filterValues[0];
            case '>': 
                return value > this.filterValues[0];
            case '>=': 
                return value >= this.filterValues[0];
            case '<': 
                return value < this.filterValues[0];
            case '<=': 
                return value <= this.filterValues[0];
            case 'Between': 
                return value >= this.filterValues[0] && value <= this.filterValues[1];
        }
    }
    toSQLWhereClause(): string {
        switch (this.operation) {
            case 'IsEmpty':
                return `${this.apiName} IS NULL`;
            case 'IsNotEmpty':
                return `${this.apiName} IS NOT NULL`;
            case 'IsEqual':
                return `${this.apiName} IN (${this.filterValues.map(val => val.toString()).join(', ')})`;
            case 'IsNotEqual':
                return `${this.apiName} NOT IN (${this.filterValues.map(val => val.toString()).join(', ')})`;
            case '=': 
                return `${this.apiName} = ${this.filterValues[0]}`;
            case '!=': 
                return `${this.apiName} != ${this.filterValues[0]}`;
            case '>': 
                return `${this.apiName} > ${this.filterValues[0]}`;
            case '>=': 
                return `${this.apiName} >= ${this.filterValues[0]}`;
            case '<': 
                return `${this.apiName} < ${this.filterValues[0]}`;
            case '<=': 
                return `${this.apiName} <= ${this.filterValues[0]}`;
            case 'Between': 
                return `${this.apiName} >= ${this.filterValues[0]} AND ${this.apiName} <= ${this.filterValues[0]}`;
        }
    }

}