import { DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
interface Keys {
    PartitionKey: string;
    SortKey?: string;
}
interface DynamoDBArgs {
    TableName: string;
    Config?: DynamoDBClientConfig;
}
export declare class DynamoDB<T> {
    private readonly TableName;
    private readonly DynamoDB;
    private readonly DocumentClient;
    constructor({ TableName, Config }: DynamoDBArgs);
    private key;
    all<ItemType = T>(Limit?: number): Promise<ItemType[]>;
    get<ItemType = T>(Key: string): Promise<ItemType>;
    put<ItemType = T>(Item: ItemType): Promise<ItemType>;
    delete<ItemType = T>(Key: string): Promise<ItemType>;
    update<PropsType, ItemType = T>(Key: string, newprops: PropsType): Promise<ItemType>;
    purge(): Promise<string>;
    initialize(Keys: Keys): Promise<string>;
}
export {};
