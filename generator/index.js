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
    function DynamoDBGenerator(props) {
        this.props = props;
    }
    DynamoDBGenerator.prototype.AttributeValues = function () {
        var _a;
        var AttributeValues;
        for (var _i = 0, _b = Object.entries(this.props); _i < _b.length; _i++) {
            var _c = _b[_i], key = _c[0], value = _c[1];
            AttributeValues = __assign(__assign({}, AttributeValues), (_a = {}, _a[":_".concat(key, "_")] = value, _a));
        }
        return AttributeValues;
    };
    DynamoDBGenerator.prototype.AttributeNames = function () {
        var _a;
        var AttributeNames;
        for (var key in this.props) {
            AttributeNames = __assign(__assign({}, AttributeNames), (_a = {}, _a["#_".concat(key, "_")] = key, _a));
        }
        return AttributeNames;
    };
    DynamoDBGenerator.prototype.UpdateExpression = function () {
        var Expressions = [];
        for (var key in this.props) {
            Expressions.push("#_".concat(key, "_ = :_").concat(key, "_"));
        }
        return "SET ".concat([Expressions]);
    };
    return DynamoDBGenerator;
}());
exports.DynamoDBGenerator = DynamoDBGenerator;
