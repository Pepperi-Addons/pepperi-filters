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

## JSONFilterTransformer
Travese through a JSON filter tree and transform nodes or emit them entirely.
This is useful when we create an API than returns some tranformed model from one or more other APIs.

#### example
For example we will use the data_views API (https://papi.pepperi.com/v1.0/meta_data/data_views). It supports all the regular API functions (GET, POST, etc.), but saves & gets the data based on the UIControls API (https://papi.pepperi.com/v1.0/UIControls).

So lets say the data_views endpoint gets a filter in a `SQL WHERE` clause like so: 
``` SQL
(Hidden = false) AND (Context.Name = 'OrderMenu') AND (Type = 'Grid' OR CreationDate > '2020-06-01T07:33:33.707Z')
```

Taking this query apart:

`Hidden = false` - can be sent to the UIControl endpoint

`Context.Name = 'OrderMenu'` - translates on the UIControl endpoint to `Type LIKE '%OrderMenu%'`

`Type = 'Grid'` - has no translation in the UIControl API

`CreationDate > '2020-06-01T07:33:33.707Z'` - can also be sent to the UIControl

We want to transform queries that need to be transformed.
We want to emlinate queries that aren't supported on the API. We also need to eliminate any queries that are `OR`'d with that query b/c we need the call to the UIControl API to be >= to the call to the data_views API call.
In summary the query we want to send the following filter to the UIControl API
``` SQL
(Hidden = false) AND (Type LIKE '%OrderMenu%')
```

#### Usage
``` Typescript
import { SQLWhereParser, JSONFilterTransformer } from '@pepperi-addons/pepperi-filters'

const where = "(Hidden = false) AND (Context.Name = 'OrderMenu') AND (Type = 'Grid' OR CreationDate > '2020-06-01T07:33:33.707Z')";

// first let's turn this into a JSON Filter
const parser = new SQLWhereParser([
    {
        FieldType: 'Bool',
        FieldName: 'Hidden'
    },
    {
        FieldType: 'Context.Name',
        FieldName: 'String'
    },
    {
        FieldType: 'Type',
        FieldName: 'String'
    },
    {
        FieldType: 'CreationDate',
        FieldName: 'DateTime'
    },
]);
const filter = parser.parse(where);
const transformer = new JSONFilterTransformer(new Map([
    
    // Type doesn't exist on UIControls
    ['Type', (node: JSONBaseFilter): boolean => { return false } ],
    
    // Context.Name maps to part of UIControl.Type
    ['Context.Name', (node: JSONBaseFilter) => { 

        // no matter what the operation - it is alway only contains
        node.Operation = 'Contains'
        node.ApiName = 'Type'

        return true 
    } ]
]));
const transformed = transformer.transform(filter);
console.log(transformed);

// TODO: we need to add support for creating a SQL filter from this transformed JSON filter

```
#### Output
``` JSON
{
    "Operation": "AND",
    "LeftNode": {
        "FieldType": "Bool",
        "ApiName": "Hidden",
        "Operation": "IsEqual",
        "Values": []
    },
    "RigthNode": {
        "FieldType": "String",
        "ApiName": "Type",
        "Operation": "Contains",
        "Values": [ "OrderMenu" ]
    }
}
```
