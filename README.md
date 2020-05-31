# pepperi-filters

Useful utilies for working with **Pepperi** `SQL` clause filters & **Pepperi** JSON Filters

## Installation
Install by running 
``` 
npm install @pepperi-addons/pepperi-filters
```

## SQLWhereParser
Convert an SQL clause into a JSON filter.

#### Usage
``` Typescript
import { SQLWhereParser } from '@pepperi-addons/pepperi-filters'

const parser = new SQLWhereParser([
    {
        FieldType: 'String',
        FieldName: 'TSAString'
    }
]);
const filter = parser.parse("TSAString LIKE '%Hello%'");
console.log(filter); 
}
```
#### Output
``` JSON
{
    "FieldType": "String",
    "ApiName": "TSAString",
    "Operation": "Contains",
    "Values": [
        "Hello"
    ]
}
```
