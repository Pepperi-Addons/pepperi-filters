const SqlWhereParser = require('sql-where-parser');

module.exports = function(where) {
    const parser = new SqlWhereParser();
    return parser.parse(where)
}