import { JSONRegularFilter } from "../../json-filter"
import { SchemeFieldType } from "./metadata"
import { IPepSmartFilterData } from "../json-to-ngx/ngx-types"
import { NgxToJsonDateFilterBuilder, NgxToJsonNumberFilterBuilder, NgxToJsonStringFilterBuilder } from "./ngx-to-json-builders"

export class NgxToJsonFilterBuilder{
    static build(filter: IPepSmartFilterData, type: SchemeFieldType): JSONRegularFilter{
        try{
            switch (type){
                case "Integer":
                case "Double":
                    return NgxToJsonNumberFilterBuilder.build(filter, type)
                case 'ContainedResource':
                case 'Resource':
                case "String":
                    return  NgxToJsonStringFilterBuilder.build(filter)
                case "DateTime":
                    return  NgxToJsonDateFilterBuilder.build(filter)
                default:
                    throw Error(`type ${type} is not supported yet`)
            }
        }catch(err){
            throw Error(`in ngx to json filter builder - ${err}`)
        }
    }
}