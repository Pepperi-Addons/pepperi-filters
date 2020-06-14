import parser from './parser'
import { JSONFilter, FieldType, BasicOperations, DateOperation, StringOperation, AnyOperation, JSONBoolOperation, NumberOperation } from './json-filter';

export class SQLWhereParser {

    constructor(private fields: { [key: string]: FieldType } ) {

    }

    /**
     * Parse a SQL where clause into a JSON Filter
     * @param where An SQL style WHERE clause
     */
    parse(where: string): JSONFilter {
        const ast = parser(where);
        return this.parseNode(ast);
    }

    private parseNode(node: any): JSONFilter {
        if (node.AND) {
            return {
                Operation: 'AND',
                LeftNode: this.parseNode(node.AND[0]),
                RightNode: this.parseNode(node.AND[1]),
            }
        }
        else if (node.OR) {
            return {
                Operation: 'OR',
                LeftNode: this.parseNode(node.OR[0]),
                RightNode: this.parseNode(node.OR[1]),
            }
        }
        else {
            return this.parseExpression(node)
        }
    }

    private parseExpression(expression: any): JSONFilter {

        let operation = Object.keys(expression)[0]

        // NOT IN 
        if (operation === 'IN' && typeof expression[operation][0] === 'object' && Object.keys(expression[operation][0])[0] === 'NOT') {
            expression = {
                'NOT IN': [
                    expression[operation][0].NOT[0],
                    expression[operation][1]
                ]
            }
            operation = 'NOT IN';
        }
        
        // We only support where clauses that the ApiName is on the left side of each operation
        const apiName = expression[operation][0];
        if (!apiName) {
            throw new Error("Left side isn't an FieldName");
        }

        // make sure this field is registered
        const fieldType = this.fields[apiName];
        if (fieldType === undefined) {
            throw new Error(`Missing FieldID when trying to parse queryString. FieldID: ${apiName}`)
        }

        let values = this.parseValues(expression[operation][1]);

        let operator: AnyOperation | undefined = undefined;
        switch (fieldType) {
            case 'Bool': {
                break; // operation doesn't matter
            }

            case 'JsonBool': {
                operator = this.parseJsonBoolOperation(operation);
                break;
            }

            case 'Integer':
            case 'Double': {
                operator = this.parseNumberOperation(operation, values);
                break;
            }

            case 'String': {
                operator = this.parseStringOperation(operation, values);
                break;
            }

            case 'Date': 
            case 'DateTime': {
                operator = this.parseDateOperation(operation, values);
                break;
            }

            case 'Guid': {
                operator = this.parseBasicExpression(operation, values);
                break;
            }
                
            default:
                break;
        }

        if (!operator) {
            throw new Error(`Could not parse operator ${operation} with values: ${values} for type: ${fieldType}`);
        } 

        const res: any = {
            ApiName: apiName,
            FieldType: fieldType,
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

            case '!=': {
                res = 'IsNotEqual';
                break;
            }

            case 'IS': {
                const value = values.pop()
                if (value === 'null') {
                    res = 'IsEmpty';
                }
                else if (value === 'not null') {
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
                const value = values.pop()
                if (value === 'null') {
                    res = 'IsEmpty';
                }
                else if (value === 'not null') {
                    res = 'IsNotEmpty';
                }
                break;
            }
        }

        return res;
    }

    private parseValues(value: any): string[] {
        let res = [];

        if (typeof value === 'string') {
            res.push(value);
        }
        else if (typeof value === 'number') {
            res.push(value.toString());
        }
        else if (value === null) {
            res.push('null')
        }
        else if (typeof value === 'object' && value.NOT && value.NOT[0] === null) {
            res.push('not null');
        }
        else if (Array.isArray(value)) {
            res = value.map(val => this.parseValues(val)[0])
        }
        else {
            throw new Error(`Could no parse values from expression: ${value}`);
        }

        return res;
    }
}