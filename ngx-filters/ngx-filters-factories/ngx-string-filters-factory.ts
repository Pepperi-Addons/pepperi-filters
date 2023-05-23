import { JSONStringFilter } from '../..';
import {
    NGXFilterBeginsWithOperation,
    NGXFilterContainsOperation,
    NGXFilterEndsWithOperation,
    NGXFilterIsEqualOperation,
    NGXFilterNotEqualOperation,
    NGXFilterOperation,
} from '../json-to-ngx/ngx-filters-operations';

export class NGXStringFiltersFactory {
    static create(filter: JSONStringFilter): NGXFilterOperation {
        switch (filter.Operation) {
            case 'IsEqual':
                return new NGXFilterIsEqualOperation(filter);
            case 'IsNotEqual':
                return new NGXFilterNotEqualOperation(filter);
            case 'Contains':
                return new NGXFilterContainsOperation(filter);
            case 'EndWith':
                return new NGXFilterEndsWithOperation(filter);
            case 'StartWith':
                return new NGXFilterBeginsWithOperation(filter);
            default:
                throw Error(`operation ${filter.Operation} of string filter is not supported for ngx filters`);
        }
    }
}
