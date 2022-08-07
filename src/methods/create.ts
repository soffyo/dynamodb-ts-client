import { CreateTableCommand, KeySchemaElement, AttributeDefinition } from "@aws-sdk/client-dynamodb"
import { TSClientMethodConfig, InitConfig, KeySchema } from "../types"
import { checkMissingArg, checkKeySchema } from "../errors"

export async function create<T>({ table, client }: TSClientMethodConfig, { Keys, BillingMode }: InitConfig<T>): Promise<string> {
    checkMissingArg(Keys, "You must provide a KeySchema to create a new table!")
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
    checkKeySchema(keys)
    let KeySchema: Array<KeySchemaElement> = [{
        AttributeName: keys.PartitionKey.Name as string,
        KeyType: "HASH"
    }]    
    if (keys.SortKey) {
        KeySchema.push({
            AttributeName: keys.SortKey.Name as string,
            KeyType: "RANGE"
        })
    }
    return KeySchema
}

function attributeDefinitions<T extends Record<string,any>>(keys: KeySchema<T>): [AttributeDefinition, AttributeDefinition?]  {
    let AttributeDefinitions: [AttributeDefinition, AttributeDefinition?] = [{
        AttributeName: keys.PartitionKey.Name as string,
        AttributeType: keys.PartitionKey.Type
    }]    
    if (keys.SortKey) {
        AttributeDefinitions.push({
            AttributeName: keys.SortKey.Name as string,
            AttributeType: keys.SortKey.Type
        })
    }
    return AttributeDefinitions
}