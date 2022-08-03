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
exports.create = void 0;
var client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
var errors_1 = require("../errors");
function create(_a, _b) {
    var table = _a.table, client = _a.client;
    var Keys = _b.Keys, BillingMode = _b.BillingMode;
    return __awaiter(this, void 0, void 0, function () {
        var command, TableDescription;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    (0, errors_1.checkMissingArg)(Keys, "You must provide a KeySchema to create a new table!");
                    command = new client_dynamodb_1.CreateTableCommand({
                        BillingMode: BillingMode,
                        TableName: table,
                        KeySchema: keySchema(Keys),
                        AttributeDefinitions: attributeDefinitions(Keys)
                    });
                    return [4 /*yield*/, client.send(command)];
                case 1:
                    TableDescription = (_c.sent()).TableDescription;
                    return [2 /*return*/, "Table \"".concat(TableDescription.TableName, "\" created successfully")];
            }
        });
    });
}
exports.create = create;
function keySchema(keys) {
    (0, errors_1.checkKeySchema)(keys);
    var KeySchema = [{
            AttributeName: keys.PartitionKey.Name,
            KeyType: "HASH"
        }];
    if (keys.SortKey) {
        KeySchema.push({
            AttributeName: keys.SortKey.Name,
            KeyType: "RANGE"
        });
    }
    return KeySchema;
}
function attributeDefinitions(keys) {
    var AttributeDefinitions = [{
            AttributeName: keys.PartitionKey.Name,
            AttributeType: keys.PartitionKey.Type
        }];
    if (keys.SortKey) {
        AttributeDefinitions.push({
            AttributeName: keys.SortKey.Name,
            AttributeType: keys.SortKey.Type
        });
    }
    return AttributeDefinitions;
}
