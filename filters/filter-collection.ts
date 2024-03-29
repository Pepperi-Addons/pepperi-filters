import esb, { Query } from 'elastic-builder';
import { DynamoResultObject } from './DynamoObjectResult';
import Filter from './filter';
import { IPepSmartFilterData } from '../ngx-filters';

export default class FilterCollection extends Filter {
    toNgxFilter(): IPepSmartFilterData[] {
        if (!this.useAndOperation) {
            throw new Error('only and operation supported in IPepSmartFilterData array.');
        }
        let result: IPepSmartFilterData[] = [];
        this.filters.forEach((filter) => {
            let ngxFilter = filter.toNgxFilter();
            if (!Array.isArray(ngxFilter)) {
                ngxFilter = [ngxFilter];
            }
            result = result.concat(ngxFilter);
        });
        return result;
    }
    constructor(private useAndOperation: boolean = true, private filters: Filter[] = []) {
        super('');
    }

    addFilter(filter: Filter) {
        this.filters.push(filter);
    }

    apply(): boolean {
        throw new Error('Not implemented');
    }

    filter(object: any, getValueFunc?: (object: any, apiName: string) => any) {
        let res = true;

        for (const filter of this.filters) {
            res = filter.filter(object, getValueFunc);

            if (res != this.useAndOperation) {
                break;
            }
        }

        return res;
    }

    toSQLWhereClause(): string {
        let res = '';

        this.filters.forEach((filter) => {
            const innerClause = filter.toSQLWhereClause();
            if (innerClause) {
                // if it is not the first filter add the operation
                if (res) {
                    res += ` ${this.useAndOperation ? 'AND' : 'OR'} `;
                }

                res += `(${innerClause})`;
            }
        });

        return res;
    }

    toKibanaFilter(timeZoneOffset?: string): Query {
        const boolQuery = esb.boolQuery();
        const query: Query[] = [];
        this.filters.forEach((filter) => {
            const innerClause = filter.toKibanaFilter(timeZoneOffset);
            if (innerClause) {
                query.push(innerClause);
            }
        });

        if (this.useAndOperation) {
            boolQuery.must(query);
        } else {
            boolQuery.should(query);
        }

        return boolQuery;
    }

    toDynamoDBQuery(
        letterForMark: string,
        expressionAttributeNames: any,
        expressionAttributeValues: any,
        count: number,
    ): DynamoResultObject {
        const res: DynamoResultObject = {
            Count: count,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ResString: '',
        };

        this.filters.forEach((filter) => {
            count = res.Count;
            const DynamoWhereClause = filter.toDynamoDBQuery(
                letterForMark,
                expressionAttributeNames,
                expressionAttributeValues,
                count,
            );
            const innerClause = DynamoWhereClause.ResString;
            if (innerClause) {
                // if it is not the first filter add the operation
                if (res.ResString) {
                    res.ResString += ` ${this.useAndOperation ? 'AND' : 'OR'} `;
                }

                res.ResString += `(${innerClause})`;
                res.Count += DynamoWhereClause.Count;
                Object.entries(DynamoWhereClause.ExpressionAttributeValues).forEach(
                    ([key, value]) => (res.ExpressionAttributeValues[key] = value),
                );
                Object.entries(DynamoWhereClause.ExpressionAttributeNames).forEach(
                    ([key, value]) => (res.ExpressionAttributeNames[key] = value),
                );
            }
        });
        return res;
    }
}
