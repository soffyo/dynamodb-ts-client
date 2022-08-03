"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.put = void 0;
var lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
var utilities_1 = require("../utilities");
var generator_1 = require("../generator");
var errors_1 = require("../errors");
function put(_a, input) {
    var table = _a.table, client = _a.client;
    return __awaiter(this, void 0, void 0, function () {
        var _b, PKName, SKName, names, conditionExpression, inputs, _i, inputs_1, item, command, command;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    (0, errors_1.checkMissingArg)(input, "At least one object to put must be provided.");
                    (0, errors_1.checkReservedNames)(input);
                    return [4 /*yield*/, (0, generator_1.keys)({ table: table, client: client })];
                case 1:
                    _b = _d.sent(), PKName = _b.PKName, SKName = _b.SKName;
                    names = [PKName, SKName];
                    conditionExpression = function () {
                        var expression = "attribute_not_exists (#".concat(PKName, ")");
                        if (SKName !== undefined) {
                            expression += " AND attribute_not_exists (#".concat(SKName, ")");
                        }
                        return expression;
                    };
                    if (!Array.isArray(input)) return [3 /*break*/, 6];
                    inputs = (0, utilities_1.splitItems)(input);
                    _i = 0, inputs_1 = inputs;
                    _d.label = 2;
                case 2:
                    if (!(_i < inputs_1.length)) return [3 /*break*/, 5];
                    item = inputs_1[_i];
                    command = new lib_dynamodb_1.BatchWriteCommand({
                        RequestItems: (_c = {},
                            _c[table] = item.map(function (Item) { return ({
                                PutRequest: { Item: Item }
                            }); }),
                            _c)
                    });
                    return [4 /*yield*/, client.send(command)];
                case 3:
                    _d.sent();
                    _d.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/, input];
                case 6:
                    command = new lib_dynamodb_1.PutCommand({
                        TableName: table,
                        ExpressionAttributeNames: (0, generator_1.attributeNames)(names),
                        ConditionExpression: conditionExpression(),
                        Item: input
                    });
                    return [4 /*yield*/, client.send(command)];
                case 7:
                    _d.sent();
                    return [2 /*return*/, input];
            }
        });
    });
}
exports.put = put;
