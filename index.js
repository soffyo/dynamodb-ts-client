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
var DynamoDB = /** @class */ (function () {
    function DynamoDB(_a) {
        var TableName = _a.TableName, _b = _a.Config, Config = _b === void 0 ? { region: process.env.AWS_REGION } : _b;
        this.TableName = TableName;
        this.DynamoDB = new client_dynamodb_1.DynamoDBClient(Config);
        this.DocumentClient = lib_dynamodb_1.DynamoDBDocumentClient.from(this.DynamoDB);
    }
    DynamoDB.prototype.key = function (index) {
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
    DynamoDB.prototype.get = function (Key) {
        return __awaiter(this, void 0, void 0, function () {
            var command, _a, Item;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = lib_dynamodb_1.GetCommand.bind;
                        _b = {
                            TableName: this.TableName
                        };
                        _c = {};
                        return [4 /*yield*/, this.key(0)];
                    case 1:
                        command = new (_a.apply(lib_dynamodb_1.GetCommand, [void 0, (_b.Key = (_c[_d.sent()] = Key,
                                _c),
                                _b)]))();
                        return [4 /*yield*/, this.DocumentClient.send(command)];
                    case 2:
                        Item = (_d.sent()).Item;
                        return [2 /*return*/, Item];
                }
            });
        });
    };
    DynamoDB.prototype.put = function (Item) {
        return __awaiter(this, void 0, void 0, function () {
            var command, _a, _b, error_1;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = lib_dynamodb_1.PutCommand.bind;
                        _c = {
                            TableName: this.TableName
                        };
                        _b = "attribute_not_exists(".concat;
                        return [4 /*yield*/, this.key(0)];
                    case 1:
                        command = new (_a.apply(lib_dynamodb_1.PutCommand, [void 0, (_c.ConditionExpression = _b.apply("attribute_not_exists(", [_d.sent(), ")"]),
                                _c.Item = Item,
                                _c)]))();
                        _d.label = 2;
                    case 2:
                        _d.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.DocumentClient.send(command)];
                    case 3:
                        _d.sent();
                        return [2 /*return*/, Item];
                    case 4:
                        error_1 = _d.sent();
                        throw new Error("An error occurred");
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    DynamoDB.prototype["delete"] = function (Key) {
        return __awaiter(this, void 0, void 0, function () {
            var command, _a, Attributes;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = lib_dynamodb_1.DeleteCommand.bind;
                        _b = {
                            TableName: this.TableName
                        };
                        _c = {};
                        return [4 /*yield*/, this.key(0)];
                    case 1:
                        command = new (_a.apply(lib_dynamodb_1.DeleteCommand, [void 0, (_b.Key = (_c[_d.sent()] = Key,
                                _c),
                                _b.ReturnValues = "ALL_OLD",
                                _b)]))();
                        return [4 /*yield*/, this.DocumentClient.send(command)];
                    case 2:
                        Attributes = (_d.sent()).Attributes;
                        return [2 /*return*/, Attributes];
                }
            });
        });
    };
    DynamoDB.prototype.update = function (Key, newprops) {
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
                        return [4 /*yield*/, this.key(0)];
                    case 1:
                        _c.ConditionExpression = _b.apply("attribute_exists(", [_e.sent(), ")"]);
                        _d = {};
                        return [4 /*yield*/, this.key(0)];
                    case 2:
                        command = new (_a.apply(lib_dynamodb_1.UpdateCommand, [void 0, (_c.Key = (_d[_e.sent()] = Key,
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
    DynamoDB.prototype.purge = function () {
        return __awaiter(this, void 0, void 0, function () {
            var items, requests, command, error_2;
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.all()];
                    case 1:
                        items = _b.sent();
                        requests = items.map(function (item) { return __awaiter(_this, void 0, void 0, function () {
                            var _a, _b;
                            var _c, _d, _e;
                            return __generator(this, function (_f) {
                                switch (_f.label) {
                                    case 0:
                                        _c = {};
                                        _d = {};
                                        _e = {};
                                        return [4 /*yield*/, this.key(0)];
                                    case 1:
                                        _a = _f.sent();
                                        _b = item;
                                        return [4 /*yield*/, this.key(0)];
                                    case 2: return [2 /*return*/, (_c.DeleteRequest = (_d.Key = (_e[_a] = _b[_f.sent()],
                                            _e),
                                            _d),
                                            _c)];
                                }
                            });
                        }); });
                        command = new lib_dynamodb_1.BatchWriteCommand({
                            RequestItems: (_a = {},
                                _a[this.TableName] = requests,
                                _a)
                        });
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.DocumentClient.send(command)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, "Every element (".concat(items.length.toString(), ") on Table: \"").concat(this.TableName, "\" has been deleted successfully.")];
                    case 4:
                        error_2 = _b.sent();
                        return [2 /*return*/, "An error occurred."];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    DynamoDB.prototype.initialize = function (Keys) {
        return __awaiter(this, void 0, void 0, function () {
            var command, TableDescription;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        command = new client_dynamodb_1.CreateTableCommand({
                            TableName: this.TableName,
                            BillingMode: "PAY_PER_REQUEST",
                            KeySchema: [
                                {
                                    AttributeName: Keys.PartitionKey,
                                    KeyType: "HASH"
                                },
                                {
                                    AttributeName: Keys.SortKey,
                                    KeyType: "RANGE"
                                }
                            ],
                            AttributeDefinitions: [
                                {
                                    AttributeName: Keys.PartitionKey,
                                    AttributeType: "S"
                                },
                                {
                                    AttributeName: Keys.SortKey,
                                    AttributeType: "S"
                                }
                            ]
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
    return DynamoDB;
}());
exports.DynamoDB = DynamoDB;
