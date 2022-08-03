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
exports.conditionAttributeValues = exports.attributeNames = exports.attributeValues = void 0;
var utilities_1 = require("../utilities");
var operators_1 = require("../operators");
function attributeValues(obj) {
    var values = {};
    var addPath = function (a, b) { return a ? "".concat(a, "_dynamoDBSeparator_").concat(b) : b; };
    void (function iterate(obj, head) {
        if (obj === void 0) { obj = {}; }
        if (head === void 0) { head = ''; }
        Object.entries(obj).reduce(function (a, _a) {
            var _b;
            var key = _a[0], value = _a[1];
            if (value !== "__removeDynamoDBAttribute") {
                var path = addPath(head, key);
                if ((0, utilities_1.isObject)(value)) {
                    return iterate(value, path);
                }
                else {
                    values = __assign(__assign({}, values), (_b = {}, _b[":".concat(path)] = value, _b));
                }
            }
        }, []);
    })(obj);
    return values;
}
exports.attributeValues = attributeValues;
function attributeNames(input) {
    if (!input) {
        return;
    }
    var names;
    input.forEach(function (item) {
        var _a;
        return names = __assign(__assign({}, names), (_a = {}, _a["#".concat(String(item))] = item, _a));
    });
    return names;
}
exports.attributeNames = attributeNames;
function conditionAttributeValues(obj, marker) {
    if (marker === void 0) { marker = "_condition"; }
    var values = {};
    var addPath = function (a, b) { return a ? "".concat(a, "_dynamoDBSeparator_").concat(b) : b; };
    void (function iterate(obj, head) {
        if (obj === void 0) { obj = {}; }
        if (head === void 0) { head = ''; }
        Object.entries(obj).reduce(function (a, _a) {
            var _b, _c;
            var key = _a[0], value = _a[1];
            var path = !operators_1.operators.includes(key) ? addPath(head, key) : head;
            if ((0, utilities_1.isObject)(value) && key !== "size") {
                return iterate(value, path);
            }
            else {
                switch (key) {
                    case "BETWEEN":
                    case "between":
                        if (Array.isArray(value)) {
                            values = __assign(__assign({}, values), (_b = {}, _b[":".concat(path, "1").concat(marker)] = value[0], _b[":".concat(path, "2").concat(marker)] = value[1], _b));
                        }
                        break;
                    case "in":
                    case "IN":
                        if (Array.isArray(value)) {
                            value.forEach(function (item, index) {
                                var _a;
                                values = __assign(__assign({}, values), (_a = {}, _a[":".concat(path, "_").concat(index, "_in_").concat(marker)] = value[index], _a));
                            });
                        }
                        break;
                    case "size":
                        var operator = Object.keys(obj[key])[0];
                        values = __assign(__assign({}, values), { ":size_dynamoDbOperator": obj[key][operator] });
                        break;
                    case "attribute_exists":
                        values = __assign({}, values);
                        break;
                    default: values = __assign(__assign({}, values), (_c = {}, _c[":".concat(path).concat(marker)] = value, _c));
                }
            }
        }, []);
    })(obj);
    return values;
}
exports.conditionAttributeValues = conditionAttributeValues;
