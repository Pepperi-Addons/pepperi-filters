import { JSONJsonBoolFilter } from "../../json-filter";
import { NGXFilterIsEqualOperation, NGXFilterOperation } from "../json-to-ngx/ngx-filters-operations";

export class NGXBooleanFiltersFactory{
    static create(filter: JSONJsonBoolFilter): NGXFilterOperation{
        switch(filter.Operation){
            case 'IsEqual':
                return new NGXFilterIsEqualOperation(filter)
            default: 
                throw Error(`operation ${filter.Operation} is not supported for boolean filters`)
        }

    }
}