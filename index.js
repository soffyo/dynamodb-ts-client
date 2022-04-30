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
exports.DynamoDB = void 0;
var client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
var lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
var generator_1 = require("./generator");
// type Output<ItemType,CommandType,OmitType extends string> = Omit<CommandType,OmitType> & {[k in OmitType]?: ItemType}
var DynamoDB = /** @class */ (function () {
    function DynamoDB(_a) {
        var TableName = _a.TableName, _b = _a.Config, Config = _b === void 0 ? { region: process.env.AWS_REGION } : _b;
        this.TableName = TableName;
        this.DynamoDB = new client_dynamodb_1.DynamoDBClient(Config);
        this.DocumentClient = lib_dynamodb_1.DynamoDBDocumentClient.from(this.DynamoDB);
    }
    DynamoDB.prototype.keys = function (index) {
        return __awaiter(this, void 0, void 0, function () {
            var command, Table;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        command = new client_dynamodb_1.DescribeTableCommand({ TableName: this.TableName });
                        return [4 /*yield*/, this.DocumentClient.send(command)];
                    case 1:
                        Table = (_a.sent()).Table;
                        return [2 /*return*/, Table.KeySchema[index].AttributeName];
                }
            });
        });
    };
    DynamoDB.prototype.all = function (Limit) {
        return __awaiter(this, void 0, void 0, function () {
            var command, Items;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        command = new lib_dynamodb_1.ScanCommand({
                            TableName: this.TableName,
                            Limit: Limit
                        });
                        return [4 /*yield*/, this.DocumentClient.send(command)];
                    case 1:
                        Items = (_a.sent()).Items;
                        return [2 /*return*/, Items];
                }
            });
        });
    };
    DynamoDB.prototype.get = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var key_1, command, Responses, command, _a, Item;
            var _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!Array.isArray(input)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.keys(0)];
                    case 1:
                        key_1 = _e.sent();
                        command = new lib_dynamodb_1.BatchGetCommand({
                            RequestItems: (_b = {},
                                _b[this.TableName] = {
                                    Keys: input.map(function (item) {
                                        var _a;
                                        return (_a = {},
                                            _a[key_1] = item,
                                            _a);
                                    })
                                },
                                _b)
                        });
                        return [4 /*yield*/, this.DocumentClient.send(command)];
                    case 2:
                        Responses = (_e.sent()).Responses;
                        return [2 /*return*/, Responses[this.TableName]];
                    case 3:
                        _a = lib_dynamodb_1.GetCommand.bind;
                        _c = {
                            TableName: this.TableName
                        };
                        _d = {};
                        return [4 /*yield*/, this.keys(0)];
                    case 4:
                        command = new (_a.apply(lib_dynamodb_1.GetCommand, [void 0, (_c.Key = (_d[_e.sent()] = input,
                                _d),
                                _c)]))();
                        return [4 /*yield*/, this.DocumentClient.send(command)];
                    case 5:
                        Item = (_e.sent()).Item;
                        return [2 /*return*/, Item];
                }
            });
        });
    };
    DynamoDB.prototype.put = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var command, command, _a, _b;
            var _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!Array.isArray(input)) return [3 /*break*/, 2];
                        command = new lib_dynamodb_1.BatchWriteCommand({
                            RequestItems: (_c = {},
                                _c[this.TableName] = input.map(function (Item) { return ({
                                    PutRequest: { Item: Item }
                                }); }),
                                _c)
                        });
                        return [4 /*yield*/, this.DocumentClient.send(command)];
                    case 1:
                        _e.sent();
                        return [2 /*return*/, input];
                    case 2:
                        _a = lib_dynamodb_1.PutCommand.bind;
                        _d = {
                            TableName: this.TableName
                        };
                        _b = "attribute_not_exists(".concat;
                        return [4 /*yield*/, this.keys(0)];
                    case 3:
                        command = new (_a.apply(lib_dynamodb_1.PutCommand, [void 0, (_d.ConditionExpression = _b.apply("attribute_not_exists(", [_e.sent(), ")"]),
                                _d.Item = input,
                                _d)]))();
                        return [4 /*yield*/, this.DocumentClient.send(command)];
                    case 4:
                        _e.sent();
                        return [2 /*return*/, input];
                }
            });
        });
    };
    DynamoDB.prototype["delete"] = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var items, key_2, command, command, _a, Attributes;
            var _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!Array.isArray(input)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.get(input)];
                    case 1:
                        items = _e.sent();
                        return [4 /*yield*/, this.keys(0)];
                    case 2:
                        key_2 = _e.sent();
                        command = new lib_dynamodb_1.BatchWriteCommand({
                            RequestItems: (_b = {},
                                _b[this.TableName] = input.map(function (item) {
                                    var _a;
                                    return ({
                                        DeleteRequest: {
                                            Key: (_a = {},
                                                _a[key_2] = item,
                                                _a)
                                        }
                                    });
                                }),
                                _b)
                        });
                        return [4 /*yield*/, this.DocumentClient.send(command)];
                    case 3:
                        _e.sent();
                        return [2 /*return*/, items];
                    case 4:
                        _a = lib_dynamodb_1.DeleteCommand.bind;
                        _c = {
                            TableName: this.TableName
                        };
                        _d = {};
                        return [4 /*yield*/, this.keys(0)];
                    case 5:
                        command = new (_a.apply(lib_dynamodb_1.DeleteCommand, [void 0, (_c.Key = (_d[_e.sent()] = input,
                                _d),
                                _c.ReturnValues = "ALL_OLD",
                                _c)]))();
                        return [4 /*yield*/, this.DocumentClient.send(command)];
                    case 6:
                        Attributes = (_e.sent()).Attributes;
                        return [2 /*return*/, Attributes];
                }
            });
        });
    };
    DynamoDB.prototype.update = function (key, newprops) {
        return __awaiter(this, void 0, void 0, function () {
            var generator, command, _a, _b, Attributes;
            var _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        generator = new generator_1.DynamoDBGenerator(newprops);
                        _a = lib_dynamodb_1.UpdateCommand.bind;
                        _c = {
                            TableName: this.TableName,
                            ReturnValues: "ALL_NEW",
                            ExpressionAttributeNames: generator.AttributeNames(),
                            ExpressionAttributeValues: generator.AttributeValues(),
                            UpdateExpression: generator.UpdateExpression()
                        };
                        _b = "attribute_exists(".concat;
                        return [4 /*yield*/, this.keys(0)];
                    case 1:
                        _c.ConditionExpression = _b.apply("attribute_exists(", [_e.sent(), ")"]);
                        _d = {};
                        return [4 /*yield*/, this.keys(0)];
                    case 2:
                        command = new (_a.apply(lib_dynamodb_1.UpdateCommand, [void 0, (_c.Key = (_d[_e.sent()] = key,
                                _d),
                                _c)]))();
                        return [4 /*yield*/, this.DocumentClient.send(command)];
                    case 3:
                        Attributes = (_e.sent()).Attributes;
                        return [2 /*return*/, Attributes];
                }
            });
        });
    };
    DynamoDB.prototype.initialize = function (keys) {
        return __awaiter(this, void 0, void 0, function () {
            var generator, command, TableDescription;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        generator = new generator_1.DynamoDBGenerator();
                        command = new client_dynamodb_1.CreateTableCommand({
                            BillingMode: "PAY_PER_REQUEST",
                            TableName: this.TableName,
                            KeySchema: generator.TableDefinitions(keys).KeySchema,
                            AttributeDefinitions: generator.TableDefinitions(keys).AttributeDefinitions
                        });
                        return [4 /*yield*/, this.DocumentClient.send(command)];
                    case 1:
                        TableDescription = (_a.sent()).TableDescription;
                        if (!TableDescription) {
                            return [2 /*return*/, "An error occurred."];
                        }
                        return [2 /*return*/, "Table \"".concat(TableDescription.TableName, "\" created succsessfully")];
                }
            });
        });
    };
    DynamoDB.prototype.purge = function () {
        return __awaiter(this, void 0, void 0, function () {
            var items, key, command, error_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.all()];
                    case 1:
                        items = _b.sent();
                        return [4 /*yield*/, this.keys(0)];
                    case 2:
                        key = _b.sent();
                        command = new lib_dynamodb_1.BatchWriteCommand({
                            RequestItems: (_a = {},
                                _a[this.TableName] = items.map(function (item) {
                                    var _a;
                                    return ({
                                        DeleteRequest: {
                                            Key: (_a = {},
                                                _a[key] = item[key],
                                                _a)
                                        }
                                    });
                                }),
                                _a)
                        });
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, this.DocumentClient.send(command)];
                    case 4:
                        _b.sent();
                        return [2 /*return*/, "Every element (".concat(items.length.toString(), ") on Table: \"").concat(this.TableName, "\" has been deleted successfully.")];
                    case 5:
                        error_1 = _b.sent();
                        return [2 /*return*/, "An error occurred."];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    DynamoDB.prototype.drop = function () {
        return __awaiter(this, void 0, void 0, function () {
            var command, TableDescription;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        command = new client_dynamodb_1.DeleteTableCommand({
                            TableName: this.TableName
                        });
                        return [4 /*yield*/, this.DocumentClient.send(command)];
                    case 1:
                        TableDescription = (_a.sent()).TableDescription;
                        if (!TableDescription) {
                            return [2 /*return*/, "An error occurred."];
                        }
                        return [2 /*return*/, "Table \"".concat(TableDescription.TableName, "\" deleted.")];
                }
            });
        });
    };
    return DynamoDB;
}());
exports.DynamoDB = DynamoDB;
