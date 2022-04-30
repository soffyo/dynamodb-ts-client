import { Keys } from "../index";
declare type DynamoDBGeneratorProps = Record<string, Exclude<any, object>>;
declare type AttributeValue = `:_${string}_`;
declare type AttributeValues = Record<AttributeValue, any>;
declare type AttributeName = `#_${string}_`;
declare type AttributeNames = Record<AttributeName, string>;
interface KeySchema {
    AttributeName: string;
    KeyType: "HASH" | "RANGE";
}
interface AttributeDefinitions {
    AttributeName: string;
    AttributeType: "S" | "N" | "B";
}
interface TableDefinitions {
    KeySchema: KeySchema[];
    AttributeDefinitions: AttributeDefinitions[];
}
export declare class DynamoDBGenerator {
    private readonly input;
    constructor(input?: DynamoDBGeneratorProps);
    AttributeValues(): AttributeValues;
    AttributeNames(): AttributeNames;
    UpdateExpression(): string;
    TableDefinitions(keys: Keys): TableDefinitions;
}
export {};
