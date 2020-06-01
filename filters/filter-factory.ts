import { JSONFilter, JSONBaseFilter, StringOperation, NumberOperation, BasicOperations, DateOperation } from "../json-filter";
import Filter from "./filter";
import FilterCollection from "./filter-collection";
import { BooleanFilter } from "./boolean-filter";
import { StringFilter } from "./string-filter";
import { NumberFilter } from "./number-filter";
import { GuidFilter } from "./guid-filter";
import { DateFilter } from "./date-filter";

export class FilterFactory {
    createFilter(jsonFilter: JSONFilter): Filter {
        if (jsonFilter.Operation === 'AND' || jsonFilter.Operation === 'OR') {
            const f1 = this.createFilter(jsonFilter.LeftNode);
            const f2 = this.createFilter(jsonFilter.RightNode);
            return new FilterCollection(jsonFilter.Operation === 'AND', [ f1, f2 ]);
        }
        else {
            const apiName = (jsonFilter as JSONBaseFilter).ApiName;
            const values = (jsonFilter as JSONBaseFilter).Values;
            const operation = (jsonFilter as JSONBaseFilter).Operation;

            // todo: we can add validation of the operation & values
            // to see that they match.
            // eg. IsEmpty should not have any values and Between should have 2
            switch ((jsonFilter as JSONBaseFilter).FieldType) {
                case 'JsonBool':
                case 'Bool': {
                    return new BooleanFilter(apiName, this.str2bool(values[0]));
                }

                case 'String':
                case 'MultipleStringValues': {
                    return new StringFilter(apiName, operation as StringOperation, values, false);
                }

                case 'Integer':{
                    return new NumberFilter(apiName, operation as NumberOperation, values.map(x => +x));
                }

                case 'Double': {
                    return new NumberFilter(apiName, operation as NumberOperation, values.map(parseFloat));
                }

                case 'Date':
                case 'DateTime': {
                    return new DateFilter(apiName, operation as DateOperation, values);
                }

                case 'Guid': {
                    return new GuidFilter(apiName, operation as BasicOperations, values[0]);
                }
            }
        }
    }

    private str2bool(str: string | undefined): boolean {
        return (str || '').toLocaleLowerCase().startsWith('t');
    }
}