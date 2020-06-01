import Filter from "./filter";
import { BasicOperations } from "../json-filter";
const emptyGuid = '00000000-0000-0000-0000-00000000000';

export class GuidFilter extends Filter {
    
    constructor(apiName:string, private operation: BasicOperations, private filterValue: string) {
        super(apiName);
    }
    
    apply(value: any): boolean {
        const val = (value as string || emptyGuid).toLowerCase().replace(/-/g, '');
        const filterVal = (this.filterValue || emptyGuid).toLowerCase().replace(/-/g, '');

        switch (this.operation) {
            case 'IsEmpty':
                return val === emptyGuid;
            case 'IsNotEmpty':
                return val !== emptyGuid;
            case 'IsEqual':
                return val === filterVal;
            case 'IsNotEqual':
                return val !== filterVal;
        }
    }

    toSQLWhereClause(): string {
        const filterVal = (this.filterValue || emptyGuid).toLowerCase();

        switch (this.operation) {
            case 'IsEmpty':
                return `${this.apiName} IS NULL OR ${this.apiName} = '${emptyGuid}'`
            case 'IsNotEmpty':
                return `${this.apiName} IS NOT NULL AND ${this.apiName} != '${emptyGuid}'`
            case 'IsEqual':
                return `${this.apiName} = '${filterVal}'`
            case 'IsNotEqual':
                return `${this.apiName} != '${filterVal}'`
        }
    }

}