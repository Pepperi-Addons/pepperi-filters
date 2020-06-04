import Filter from "./filter";

export default class FilterCollection extends Filter {
    
    constructor(private useAndOperation: boolean = true, private filters: Filter[] = []) {
        super('');
    }

    addFilter(filter: Filter) {
        this.filters.push(filter);
    }

    apply(value: any): boolean {
        throw new Error("Not implemented");
    }

    filter(object: any) {
        let res = true;
        
        for (const filter of this.filters) {
            res = filter.filter(object);

            if (res != this.useAndOperation) {
                break;
            }
        }
        
        return res;
    }

    toSQLWhereClause(): string {
        let res = '';

        this.filters.forEach(filter => {
            const innerClause = filter.toSQLWhereClause();
            if (innerClause) {
                
                // if it is not the first filter add the operation
                if (res) {
                    res += ` ${this.useAndOperation ? 'AND' : 'OR'} `
                }

                res += `(${innerClause})`
            }
        })

        return res;
    }

}