import { JSONRegularFilter } from "../../json-filter"
import { NGXFilterBeginsWithOperation, NGXFilterBetweenOperationFactory, NGXFilterContainsOperation, NGXFilterDueInOperation, NGXFilterEndsWithOperation, NGXFilterGreaterThanOperation, NGXFilterInTheLastOperation, NGXFilterIsEmptyOperation, NGXFilterIsEqualOperation, NGXFilterIsNotEmptyOperation, NGXFilterLessThanOperation, NGXFilterNotDueInOperation, NGXFilterNotEqualOperation, NGXFilterOnOperation, NGXFilterOperation, NGXFilterThisMonthOperation, NGXFilterThisWeekOperation, NGXFilterTodayOperation } from "./ngx-filters-operations"

export class NGXFilterOperationFactory{

    static create(filter: JSONRegularFilter): NGXFilterOperation{
        if(filter.FieldType == "JsonBool" || filter.FieldType == "Guid"){
            throw Error(`error in ngx filter operation factory, cannot convert filter with type ${filter.FieldType} to ngx lib smart filter`)
        }
        switch(filter.Operation){
            case "IsEqual":
            case "=": 
                return new NGXFilterIsEqualOperation(filter)

            case "!=":
            case "IsNotEqual":
                return new NGXFilterNotEqualOperation(filter)

            case ">":
                return new NGXFilterGreaterThanOperation(filter)

            case "<":
                return new NGXFilterLessThanOperation(filter)

            case "Between":
                return NGXFilterBetweenOperationFactory.create(filter)

            case "Contains":
                return new NGXFilterContainsOperation(filter)

            case "StartWith":
                return new NGXFilterBeginsWithOperation(filter)

            case "EndWith":
                return new NGXFilterEndsWithOperation(filter)

            //dates:
            case "InTheLast":
                return new NGXFilterInTheLastOperation(filter)

            case "DueIn":
                return new NGXFilterDueInOperation(filter)
            
            case "NotDueIn":
                return new NGXFilterNotDueInOperation(filter)

            case "Today":
                return new NGXFilterTodayOperation(filter)

            case "ThisWeek":
                return new NGXFilterThisWeekOperation(filter)

            case "ThisMonth":
                return new NGXFilterThisMonthOperation(filter)
            
            case "IsEmpty":
                return new NGXFilterIsEmptyOperation(filter)

            case "IsNotEmpty":
                return new NGXFilterIsNotEmptyOperation(filter)

            case "On":
                return new NGXFilterOnOperation(filter)

            default:
                throw Error(`error: ${filter.Operation} is not supported!!`)
        }
    }
}