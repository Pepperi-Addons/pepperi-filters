import { JSONDateFilter } from '../../json-filter';
import {
    NGXFilterDateRangeOperation,
    NGXFilterDueInOperation,
    NGXFilterInTheLastOperation,
    NGXFilterIsEmptyOperation,
    NGXFilterIsNotEmptyOperation,
    NGXFilterNotDueInOperation,
    NGXFilterOnOperation,
    NGXFilterOperation,
    NGXFilterThisMonthOperation,
    NGXFilterThisWeekOperation,
    NGXFilterTodayOperation,
} from '../json-to-ngx/';

export class NGXDateFiltersFactory {
    static create(filter: JSONDateFilter): NGXFilterOperation {
        switch (filter.Operation) {
            case 'InTheLast':
                return new NGXFilterInTheLastOperation(filter);
            case 'DueIn':
                return new NGXFilterDueInOperation(filter);
            case 'NotDueIn':
                return new NGXFilterNotDueInOperation(filter);
            case 'Today':
                return new NGXFilterTodayOperation(filter);
            case 'ThisWeek':
                return new NGXFilterThisWeekOperation(filter);
            case 'ThisMonth':
                return new NGXFilterThisMonthOperation(filter);
            case 'IsEmpty':
                return new NGXFilterIsEmptyOperation(filter);
            case 'IsNotEmpty':
                return new NGXFilterIsNotEmptyOperation(filter);
            case 'On':
                return new NGXFilterOnOperation(filter);
            case 'Between':
                return new NGXFilterDateRangeOperation(filter);
            default:
                throw Error(`operation ${filter.Operation} of date filter is not supported for ngx filters`);
        }
    }
}
