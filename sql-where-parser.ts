import { Parser } from 'node-sql-parser'
import { JSONFilter, FieldType, BasicOperations, DateOperation, StringOperation, AnyOperation, JSONBoolOperation, NumberOperation } from './json-filter';

type SQLWhereOperation = {
    type: 'binary_expr'
    operator: string
    left: SQLWhereOperation | SQLWhereColumn
    right: SQLWhereOperation | SQLWhereValue
}

type SQLWhereColumn = {
    type: 'column_ref',
    column: string
}

type SQLWhereValue = {
    type: string,
    value: any
}

type SQLWherePart = SQLWhereOperation | SQLWhereColumn | SQLWhereValue;

export class SQLWhereParser {

    constructor(private fieldNames: { FieldName: string, FieldType: FieldType }[] ) {

    }

    /**
     * Parse a SQL where clause into a JSON Filter
     * @param where An SQL style WHERE clause
     */
    parse(where: string): JSONFilter {
        const parser = new Parser();
        const ast = parser.astify('SELECT * FROM t WHERE ' + where) as any;
        return this.parseNode(ast.where);
    }


    private getField(fieldName: string) {
        return this.fieldNames.find(x => x.FieldName === fieldName);
    }

    private parseNode(operation: SQLWhereOperation): JSONFilter {
        if (operation.operator == 'AND' || operation.operator == 'OR') {
            return {
                Operation: operation.operator,
                RightNode: this.parseNode(operation.right as SQLWhereOperation),
                LeftNode: this.parseNode(operation.left as SQLWhereOperation)
            }
        }
        else {
            return this.parseExpression(operation)
        }
    }

    private parseExpression(expression: SQLWhereOperation): JSONFilter {
        
        // We only support where clauses that the ApiName is on the left side of each operation
        const apiName = (expression.left as SQLWhereColumn).column;
        if (!apiName) {
            throw new Error("Left side isn't an FieldName");
        }

        // make sure this field is registered
        const field = this.getField(apiName);
        if (!field) {
            throw new Error(`Missing apifield when trying to parse queryString. FieldName: ${apiName}`)
        }

        let values = this.parseValues(expression.right as SQLWhereValue);

        let operator: AnyOperation | undefined = undefined;
        switch (field.FieldType) {
            case 'Bool': {
                break; // operation doesn't matter
            }

            case 'JsonBool': {
                operator = this.parseJsonBoolOperation(expression.operator);
                break;
            }

            case 'Integer':
            case 'Double': {
                operator = this.parseNumberOperation(expression.operator, values);
                break;
            }

            case 'String': {
                operator = this.parseStringOperation(expression.operator, values);
                break;
            }

            case 'Date': 
            case 'DateTime': {
                operator = this.parseDateOperation(expression.operator, values);
                break;
            }

            case 'Guid': {
                operator = this.parseBasicExpression(expression.operator, values);
                break;
            }
                

            default:
                break;
        }

        if (!operator) {
            throw new Error(`Could not parse operator ${expression.operator} with values: ${values} for type: ${field.FieldType}`);
        } 

        const res: any = {
            ApiName: field.FieldName,
            FieldType: field.FieldType as string,
            Operation: operator,
            Values: values
        }

        return res as JSONFilter;
    }

    private parseJsonBoolOperation(operator: string): JSONBoolOperation {
        // todo - make sure this is the right one
        return 'IsEqual';
    } 

    private parseBasicExpression(operator: string, values: string[]) {
        let res: BasicOperations | undefined;

        switch (operator) {
            case '=': {
                res = 'IsEqual';
                break;
            }

            case '!=':
            case '<>': {
                res = 'IsNotEqual';
                break;
            }

            case 'IS': {
                if (values.pop() === 'null') {
                    res = 'IsEmpty';
                }
                break;
            }

            case 'IS NOT': {
                if (values.pop() === 'null') {
                    res = 'IsNotEmpty';
                }
                break;
            }
        }

        return res;
    }

    private parseNumberOperation(operator: string, values: string[]) {
        let res: NumberOperation | undefined = this.parseBasicExpression(operator, values);

        if (!res) {
            switch (operator) {
                case '>':
                case '>=':
                case '<=':
                case '<': {
                    res = operator;
                    break;
                }
            }
        }

        return res;
    }

    private parseStringOperation(operation: string, values: string[]) {
        let res: StringOperation | undefined = this.parseBasicExpression(operation, values);

        if (!res) {
            switch (operation) {
                case 'LIKE': {
                    if (values.length == 1) {
                        let val = values[0];
                        if (val.charAt(0) === '%') { // LIKE '%acbd....
                            if (val.charAt(val.length - 1) === '%') { // LIKE '%acbd%'
                                val = val.slice(1, val.length - 1);
                                res = 'Contains';
                            }
                            else { // LIKE '%acbd'
                                val = val.slice(1, val.length);
                                res = 'EndWith';
                            }
                        }
                        else if (val.charAt(val.length - 1) === '%') { // LIKE 'abcd%'
                            val = val.slice(0, val.length - 1);
                            res = 'StartWith';
                        }
                        values[0] = val;
                    }
                    break;
                }
                case 'IN': {
                    res = 'IsEqual';
                    break;
                }
                case 'NOT IN': {
                    res = 'IsNotEqual';
                    break;
                }
            }
        }

        return res;
    }

    private parseDateOperation(operator: string, values: string[]) {
        let res: DateOperation | undefined = undefined;

        switch (operator) {
            case '=': 
            case '<=':
            case '<': 
            case '>=':
            case '>': {
                res = operator;
                break;
            }

            case 'IS': {
                if (values.pop() === 'null') {
                    res = 'IsEmpty';
                }
                break;
            }

            case 'IS NOT': {
                if (values.pop() === 'null') {
                    res = 'IsNotEmpty';
                }
                break;
            }
        }

        return res;
    }

    private parseValues(expression: SQLWhereValue): string[] {
        let res = [];

        switch (expression.type) {
            case 'string': {
                res.push(expression.value);
                break;
            }

            case 'number': {
                res.push(expression.value.toString());
                break;
            }

            case 'null': {
                res.push('null');
                break;
            }

            case 'expr_list': {
                expression.value.forEach((val: SQLWhereValue) => {
                    res.push(this.parseValues(val)[0]);
                });
                break;
            }

            default: {
                throw new Error(`Could no parse values from expression: ${JSON.stringify(expression)}`);
            }
        }

        return res;
    }
}