import Filter from './filter';
import { DateOperation, NumberOperation } from '../json-filter';
import esb, { Query } from 'elastic-builder';
import { DynamoResultObject } from './DynamoObjectResult';
import { NumberFilter } from './number-filter';

export class DateFilter extends Filter {
    constructor(apiName: string, private operation: DateOperation, private filterValues: string[]) {
        super(apiName);
    }

    apply(value: any): boolean {
        switch (this.operation) {
            case 'IsEmpty':
                return value === '' || value == undefined;
            case 'IsNotEmpty':
                return value !== '' && value != undefined;
            case '=':
                return new Date(value).getTime() == new Date(this.filterValues[0]).getTime();
            case '!=':
                return new Date(value).getTime() != new Date(this.filterValues[0]).getTime();
            case '>':
                return new Date(value).getTime() > new Date(this.filterValues[0]).getTime();
            case '>=':
                return new Date(value).getTime() >= new Date(this.filterValues[0]).getTime();
            case '<':
                return new Date(value).getTime() < new Date(this.filterValues[0]).getTime();
            case '<=':
                return new Date(value).getTime() <= new Date(this.filterValues[0]).getTime();
            case 'Today':
            case 'ThisWeek':
            case 'ThisMonth':
            case 'On':
            case 'After':
            case 'Before':
            case 'Between':
            case 'InTheLast':
            case 'InTheLastCalendar':
            case 'NotInTheLast':
            case 'NotInTheLastCalendar':
            case 'DueIn':
            case 'NotDueIn': {
                throw new Error(`Operation ${this.operation} isn't supported`);
            }
        }
    }

    toSQLWhereClause(): string {
        switch (this.operation) {
            case 'IsEmpty':
                return `${this.apiName} IS NULL`;
            case 'IsNotEmpty':
                return `${this.apiName} IS NOT NULL`;
            case '=':
                return `${this.apiName} = '${this.apiDateValue(this.filterValues[0])}'`;
            case '!=':
                return `${this.apiName} != '${this.apiDateValue(this.filterValues[0])}'`;
            case '>':
                return `${this.apiName} > '${this.apiDateValue(this.filterValues[0])}'`;
            case '>=':
                return `${this.apiName} >= '${this.apiDateValue(this.filterValues[0])}'`;
            case '<':
                return `${this.apiName} < '${this.apiDateValue(this.filterValues[0])}'`;
            case '<=':
                return `${this.apiName} <= '${this.apiDateValue(this.filterValues[0])}'`;
            case 'Today':
            case 'ThisWeek':
            case 'ThisMonth':
            case 'On':
            case 'After':
            case 'Before':
            case 'Between':
            case 'InTheLast':
            case 'InTheLastCalendar':
            case 'NotInTheLast':
            case 'NotInTheLastCalendar':
            case 'DueIn':
            case 'NotDueIn': {
                throw new Error(`Operation ${this.operation} isn't supported`);
            }
        }
    }

    apiDateValue(val: string): string {
        let res = new Date(val).toISOString();

        // get rid of ms at the end - API doesn't support this
        res = res.split('.')[0] + 'Z';

        return res;
    }

    toKibanaFilter(): Query {
        const existsFilter = esb.existsQuery(`${this.apiName}`);
        const boolQuery = esb.boolQuery();
        const rangeQuery = esb.rangeQuery(this.apiName);
        const termQueryValue = esb.termQuery(`${this.apiName}`, this.filterValues[0]);
        let unit;
        switch (this.operation) {
            case 'IsEmpty':
                return boolQuery.mustNot(existsFilter);
            case 'IsNotEmpty':
                return boolQuery.must(existsFilter);
            case '=':
                return boolQuery.must(termQueryValue);
            case '!=':
                return boolQuery.mustNot(termQueryValue);
            case '>':
                return rangeQuery.gt(this.filterValues[0]);
            case '>=':
                return rangeQuery.gte(this.filterValues[0]);
            case '<':
                return rangeQuery.lt(this.filterValues[0]);
            case '<=':
                return rangeQuery.lte(this.filterValues[0]);
            case 'Today':
                // From 00:00 today till the end of the day
                // "/d" rounded down to UTC 00:00
                return rangeQuery.lt('now+1d/d').gte('now/d');
            case 'ThisWeek':
                // From Sunday 00:00 till the end of the week
                // This should find the beginning of the current week for the start of the range
                // and the beginning of the next week for the end of the range.
                // gte note: now/w rounds to start of the week, which is Monday according to elastic documentation,
                // therefore we added -1d (we need it to be Sunday)
                return rangeQuery.lt('now+1w/w-1d').gte('now/w-1d');
            case 'ThisMonth':
                // From 1sh current month 00:00 till now
                return rangeQuery.lt('now+1M/M').gte('now/M');
            case 'On':
                const fromDate = new Date(this.filterValues[0]).setHours(0, 0, 0);
                const toDate = new Date(this.filterValues[0]).setHours(23, 59, 59);
                // From 00:00 till 23:59
                return rangeQuery.gte(fromDate).lte(toDate);
            case 'After':
                // After date + 1 (do not include the selected date)
                return rangeQuery.gte(this.filterValues[0]);
            case 'Before':
                // Before date - 1 including all empty dates
                return boolQuery.should([boolQuery.mustNot(existsFilter), rangeQuery.lt(this.filterValues[0])]);
            case 'Between':
                // Between dates including the selected dates
                return rangeQuery.gte(this.filterValues[0]).lte(this.filterValues[1]);
            case 'InTheLast':
                // Data between today and backwards based on the number of days
                unit = this.getUnitTimeCharachter();
                return rangeQuery.lt(`now+1d/d`).gte(`now-${this.filterValues[0]}${unit}`);
            case 'InTheLastCalendar':
                // same as 'InTheLast' but rounded by calendar (start of year/month/week)
                return this.buildCalendarQuery(rangeQuery);
            case 'NotInTheLast':
                unit = this.getUnitTimeCharachter();
                return boolQuery.mustNot(rangeQuery.lt(`now+1d/d`).gte(`now-${this.filterValues[0]}${unit}`));
            case 'NotInTheLastCalendar':
                // same as 'NotInTheLast' but rounded by calendar (start of year/month/week)
                return boolQuery.mustNot(this.buildCalendarQuery(rangeQuery));
            case 'DueIn':
                // From now + number of days / weeks / months
                unit = this.getUnitTimeCharachter();
                return rangeQuery.gte(`now/${unit}`).lt(`now+${this.filterValues[0]}${unit}`);
            case 'NotDueIn': {
                unit = this.getUnitTimeCharachter();
                return boolQuery.mustNot(rangeQuery.gte(`now/${unit}`).lt(`now+${this.filterValues[0]}${unit}`));
            }
        }
    }

    toDynamoDBQuery(
        letterForMark: string,
        expressionAttributeNames: any,
        expressionAttributeValues: any,
        count: number,
    ): DynamoResultObject {
        const timeInLong: number[] = [];
        this.filterValues.forEach(function (date) {
            timeInLong.push(Date.parse(date));
        });

        const filter = new NumberFilter(
            this.apiName,
            this.operation as NumberOperation,
            timeInLong.map((x) => +x),
        );
        return filter.toDynamoDBQuery(letterForMark, expressionAttributeNames, expressionAttributeValues, count);
    }

    getUnitTimeCharachter() {
        let unit;
        switch (this.filterValues[1]) {
            case 'Days':
                unit = 'd';
                break;
            case 'Weeks':
                unit = 'w';
                break;
            case 'Months':
                unit = 'M';
                break;
            case 'Years':
                unit = 'y';
                break;
        }
        return unit;
    }

    buildCalendarQuery(rangeQuery: any) {
        const unit = this.getUnitTimeCharachter();
        // elastic's week starts on Monday, here we fix it to Sunday
        const week_suffix = unit == 'w' ? '-1d' : '';
        // '0' is a uniqe case in which we return the current day/week/month
        const lt_prefix = this.filterValues[0] == '0' ? `now+1${unit}/${unit}` : `now/${unit}`;
        const gte_prefix = this.filterValues[0] == '0' ? `now/${unit}` : `now-${this.filterValues[0]}${unit}/${unit}`;
        return rangeQuery.lt(`${lt_prefix}${week_suffix}`).gte(`${gte_prefix}${week_suffix}`);
    }
}
