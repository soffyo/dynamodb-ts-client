"use strict";
exports.__esModule = true;
exports.conditionExpression = exports.updateExpression = void 0;
var operator_1 = require("./operator");
var utilities_1 = require("../utilities");
var operators_1 = require("../operators");
function updateExpression(input) {
    if (!input) {
        return null;
    }
    var updates = [];
    var removes = [];
    var addPath = function (a, b) { return a ? "".concat(a, "_dynamoDBSeparator_").concat(b) : b; };
    void (function iterate(obj, head) {
        if (obj === void 0) { obj = {}; }
        if (head === void 0) { head = ""; }
        Object.entries(obj).reduce(function (a, _a) {
            var key = _a[0], value = _a[1];
            var path = !operators_1.operators.includes(key) ? addPath(head, key) : head;
            if ((0, utilities_1.isObject)(value) && key !== "size") {
                return iterate(value, path);
            }
            else {
                var path_ = path.split("_dynamoDBSeparator_").join(".#");
                if (value == "__removeDynamoDBAttribute") {
                    removes.push("#".concat(path_));
                }
                else {
                    updates.push("#".concat(path_, " = :").concat(path));
                }
            }
        }, []);
    })(input);
    return "SET ".concat(updates.join(', '), " ").concat(removes.length > 0 ? 'REMOVE ' + removes.join(', ') : "");
}
exports.updateExpression = updateExpression;
function conditionExpression(obj, marker) {
    if (marker === void 0) { marker = "_condition"; }
    var expressions = [];
    var addPath = function (a, b) { return a ? "".concat(a, "_dynamoDBSeparator_").concat(b) : b; };
    void (function iterate(obj, head) {
        if (obj === void 0) { obj = {}; }
        if (head === void 0) { head = ""; }
        Object.entries(obj).reduce(function (a, _a) {
            var key = _a[0], value = _a[1];
            var path = !operators_1.operators.includes(key) ? addPath(head, key) : head;
            if ((0, utilities_1.isObject)(value) && key !== "size") {
                return iterate(value, path);
            }
            else {
                key = (0, operator_1.convertOperator)(key);
                var path_ = path.split("_dynamoDBSeparator_").join(".#");
                switch (key) {
                    case "between":
                    case "BETWEEN":
                        expressions.push("(#".concat(path_, " ").concat(key.toUpperCase(), " :").concat(path, "1").concat(marker, " AND :").concat(path, "2").concat(marker, ")"));
                        break;
                    case "in":
                    case "IN":
                        var values_1 = [];
                        value.forEach(function (item, index) {
                            values_1.push(":".concat(path, "_").concat(index, "_in_").concat(marker));
                        });
                        expressions.push("(#".concat(path_, " ").concat(key.toUpperCase(), " (").concat(values_1.join(", "), "))"));
                        break;
                    case "contains":
                    case "begins_with":
                        expressions.push("(".concat(key, "(#").concat(path_, ", :").concat(path).concat(marker, "))"));
                        break;
                    case "size":
                        var operator = Object.keys(obj[key])[0];
                        expressions.push("(".concat(key, "(#").concat(path_, " ").concat(operator, " :size_dynamoDbOperator)"));
                        break;
                    case "attribute_exists":
                        if (value) {
                            expressions.push("(".concat(key, "(#").concat(path_, "))"));
                        }
                        else {
                            expressions.push("(attribute_not_exists(#".concat(path_, "))"));
                        }
                        break;
                    default:
                        expressions.push("(#".concat(path_, " ").concat(key, " :").concat(path).concat(marker, ")"));
                        break;
                }
            }
        }, []);
    })(obj);
    return expressions.join(" AND ");
}
exports.conditionExpression = conditionExpression;
