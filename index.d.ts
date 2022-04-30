import { DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
export interface Keys {
    PartitionKey: string;
    SortKey?: string;
}
export interface DynamoDBArgs {
    TableName: string;
    Config?: DynamoDBClientConfig;
}
export declare class DynamoDB<Model> {
    private readonly TableName;
    private readonly DynamoDB;
    private readonly DocumentClient;
    constructor({ TableName, Config }: DynamoDBArgs);
    private keys;
    all(Limit?: number): Promise<Model[]>;
    get(input: string): Promise<Model>;
    get(input: string[]): Promise<Model[]>;
    put(input: Model): Promise<Model>;
    put(input: Model[]): Promise<Model[]>;
    delete(input: string): Promise<Model>;
    delete(input: string[]): Promise<Model[]>;
    update(key: string, newprops: Partial<Model>): Promise<Model>;
    initialize(keys: Keys): Promise<string>;
    purge(): Promise<string>;
    drop(): Promise<string>;
}
