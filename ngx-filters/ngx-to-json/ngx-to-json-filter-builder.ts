import { JSONRegularFilter } from "../../json-filter"
import { SchemeFieldType } from "./metadata"
import { IPepSmartFilterData } from "../json-to-ngx/ngx-types"
import { NgxToJsonDateFilterBuilder, NgxToJsonNumberFilterBuilder, NgxToJsonStringFilterBuilder } from "./ngx-to-json-builders"
import { concat } from '../../index'

export class NgxToJsonFilterBuilder{

    static build(filters:IPepSmartFilterData | IPepSmartFilterData[], types: {[key: string]: SchemeFieldType}){
        if(Array.isArray(filters)){
            return this.buildComplexFilter(filters, types)
        }
        else{
            return this.buildSimpleFilter(filters, types[filters.fieldId])
        }
    }

    private static buildSimpleFilter(filter: IPepSmartFilterData, type: SchemeFieldType): JSONRegularFilter{
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
    private static buildComplexFilter(filters: IPepSmartFilterData[], types: {[key: string]: SchemeFieldType}){
        const jsonFilters =  filters.map(filter => this.buildSimpleFilter(filter, types[filter.fieldId]))
        const firstFilter = jsonFilters.pop()
        if(!firstFilter){
            return undefined
        }
        return concat(true, firstFilter, ...jsonFilters)
    }
}