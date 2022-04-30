"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.DynamoDBGenerator = void 0;
var DynamoDBGenerator = /** @class */ (function () {
    function DynamoDBGenerator(input) {
        if (input != undefined) {
            this.input = input;
        }
    }
    DynamoDBGenerator.prototype.AttributeValues = function () {
        var _a;
        if (this.input) {
            var AttributeValues = void 0;
            for (var _i = 0, _b = Object.entries(this.input); _i < _b.length; _i++) {
                var _c = _b[_i], key = _c[0], value = _c[1];
                AttributeValues = __assign(__assign({}, AttributeValues), (_a = {}, _a[":_".concat(key, "_")] = value, _a));
            }
            return AttributeValues;
        }
        else {
            throw new Error("When using this method, you must pass props to the constructor");
        }
    };
    DynamoDBGenerator.prototype.AttributeNames = function () {
        var _a;
        if (this.input) {
            var AttributeNames = void 0;
            for (var key in this.input) {
                AttributeNames = __assign(__assign({}, AttributeNames), (_a = {}, _a["#_".concat(key, "_")] = key, _a));
            }
            return AttributeNames;
        }
        else {
            throw new Error("When using this method, you must pass props to the constructor");
        }
    };
    DynamoDBGenerator.prototype.UpdateExpression = function () {
        if (this.input) {
            var Expressions = [];
            for (var key in this.input) {
                Expressions.push("#_".concat(key, "_ = :_").concat(key, "_"));
            }
            return "SET ".concat([Expressions]);
        }
        else {
            throw new Error("When using this method, you must pass props to the constructor");
        }
    };
    DynamoDBGenerator.prototype.TableDefinitions = function (keys) {
        var KeySchema = [];
        var AttributeDefinitions = [];
        if (keys.PartitionKey) {
            KeySchema.push({
                AttributeName: keys.PartitionKey,
                KeyType: "HASH"
            });
            AttributeDefinitions.push({
                AttributeName: keys.PartitionKey,
                AttributeType: "S"
            });
        }
        if (keys.SortKey) {
            KeySchema.push({
                AttributeName: keys.SortKey,
                KeyType: "RANGE"
            });
            AttributeDefinitions.push({
                AttributeName: keys.SortKey,
                AttributeType: "S"
            });
        }
        return { KeySchema: KeySchema, AttributeDefinitions: AttributeDefinitions };
    };
    return DynamoDBGenerator;
}());
exports.DynamoDBGenerator = DynamoDBGenerator;
