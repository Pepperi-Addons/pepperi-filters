import { JSONDoubleFilter, JSONIntegerFilter } from '../../json-filter';
import {
    NGXFilterGreaterThanOperation,
    NGXFilterIsEqualOperation,
    NGXFilterLessThanOperation,
    NGXFilterNotEqualOperation,
    NGXFilterNumberRangeOperation,
    NGXFilterOperation,
} from '../json-to-ngx/';

export class NGXNumberFiltersFactory {
    static create(filter: JSONIntegerFilter | JSONDoubleFilter): NGXFilterOperation {
        switch (filter.Operation) {
            case 'IsEqual':
            case '=':
                return new NGXFilterIsEqualOperation(filter);
            case 'IsNotEqual':
            case '!=':
                return new NGXFilterNotEqualOperation(filter);
            case 'Between':
                return new NGXFilterNumberRangeOperation(filter);
            case '<':
                return new NGXFilterLessThanOperation(filter);
            case '>':
                return new NGXFilterGreaterThanOperation(filter);
            default:
                throw Error(`operation ${filter.Operation} of number filter is not supported for ngx filters`);
        }
    }
}
