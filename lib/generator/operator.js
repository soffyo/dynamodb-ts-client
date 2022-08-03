"use strict";
exports.__esModule = true;
exports.convertOperator = void 0;
function convertOperator(key) {
    switch (key) {
        case "equal": return "=";
        case "greater": return ">";
        case "greater_equal": return ">=";
        case "lesser_equal": return "<=";
        case "lesser": return "<";
        case "between": return "BETWEEN";
        default: return key;
    }
}
exports.convertOperator = convertOperator;
