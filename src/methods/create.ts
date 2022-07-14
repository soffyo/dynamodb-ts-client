import { CreateTableCommand, KeySchemaElement, AttributeDefinition } from "@aws-sdk/client-dynamodb"
import { TSClientMethodConfig, InitConfig, KeySchema } from "../types"

export async function create<T>({ table, client }: TSClientMethodConfig, { Keys, BillingMode }: InitConfig<T>): Promise<string> {
    const command = new CreateTableCommand({
        BillingMode,
        TableName: table,
        KeySchema: keySchema<T>(Keys),
        AttributeDefinitions: attributeDefinitions<T>(Keys)
    })
    const { TableDescription } = await client.send(command)
    return `Table "${TableDescription.TableName}" created successfully`
}

function keySchema<T extends Record<string,any>>(keys: KeySchema<T>): KeySchemaElement[] {
    if (!keys) {
        throw new Error("DynamoDBGenerator: When using keySchema(), you must pass the \"keys\" prop.")
    }
    let KeySchema: Array<KeySchemaElement> = [{
        AttributeName: keys.PartitionKey.Name,
        KeyType: "HASH"
    }]    
    if (keys.SortKey) {
        KeySchema.push({
            AttributeName: keys.SortKey.Name,
            KeyType: "RANGE"
        })
    }
    return KeySchema
}

function attributeDefinitions<T extends Record<string,any>>(keys: KeySchema<T>): [AttributeDefinition, AttributeDefinition?]  {
    if (!keys) {
        throw new Error("DynamoDBGenerator: When using attributeDefinitions(), you must pass the \"keys\" prop.")
    }
    let AttributeDefinitions: [AttributeDefinition, AttributeDefinition?] = [{
        AttributeName: keys.PartitionKey.Name,
        AttributeType: keys.PartitionKey.Type
    }]    
    if (keys.SortKey) {
        AttributeDefinitions.push({
            AttributeName: keys.SortKey.Name,
            AttributeType: keys.SortKey.Type
        })
    }
    return AttributeDefinitions
}