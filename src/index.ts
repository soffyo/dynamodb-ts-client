import { 
    DynamoDBClient, 
    DynamoDBClientConfig, 
    DescribeTableCommand,
    CreateTableCommand,
    DeleteTableCommand
} from "@aws-sdk/client-dynamodb"
import { 
    DynamoDBDocumentClient, 
    GetCommand, 
    PutCommand,
    DeleteCommand,
    UpdateCommand, 
    ScanCommand,
    BatchWriteCommand,
    BatchGetCommand
} from "@aws-sdk/lib-dynamodb"
import { DynamoDBGenerator } from "./generator"

export interface Keys {
    PartitionKey: string
    SortKey?: string
}

export interface DynamoDBArgs {
    TableName: string
    Config?: DynamoDBClientConfig
}

// type Output<ItemType,CommandType,OmitType extends string> = Omit<CommandType,OmitType> & {[k in OmitType]?: ItemType}

export class DynamoDB<Model> {
    private readonly tableName: string
    private readonly dynamodb: DynamoDBClient
    private readonly client: DynamoDBDocumentClient

    constructor({ TableName, Config = { region: process.env.AWS_REGION } }: DynamoDBArgs) {
        this.tableName = TableName 
        this.dynamodb = new DynamoDBClient(Config)
        this.client = DynamoDBDocumentClient.from(this.dynamodb)
    }

    private async keys(index: number): Promise<string> {
        const command = new DescribeTableCommand({ TableName: this.tableName })
        const { Table } = await this.client.send(command)

        return Table.KeySchema[index].AttributeName
    }

    async all(Limit?: number): Promise<Model[]> {
        const command = new ScanCommand({
            TableName: this.tableName,
            Limit
        })
        const { Items } = await this.client.send(command)

        return Items as Model[]
    }

    async get(input: string): Promise<Model>
    async get(input: string[]): Promise<Model[]>
    async get(input: string|string[]): Promise<Model|Model[]> {
        if (Array.isArray(input)) {
            const key = await this.keys(0)
            const command = new BatchGetCommand({
                RequestItems: {
                    [this.tableName]: {
                        Keys: input.map(item => ({
                            [key]: item
                        }))
                    }
                }
            })
            const { Responses } = await this.client.send(command)

            return Responses[this.tableName] as Model[]
        } else {
            const command = new GetCommand({ 
                TableName: this.tableName, 
                Key: { 
                    [await this.keys(0)]: input
                } 
            })
            const { Item } = await this.client.send(command)
    
            return Item as Model
        }
    } 

    async put(input: Model): Promise<Model>
    async put(input: Model[]): Promise<Model[]>
    async put(input: Model|Model[]): Promise<Model|Model[]> {
        if (Array.isArray(input)) {
            const command = new BatchWriteCommand({
                RequestItems: {
                    [this.tableName]: input.map(Item => ({
                        PutRequest: { Item }
                    }))
                }
            })

            await this.client.send(command)

                return input
        } else {
            const command = new PutCommand({
                TableName: this.tableName,
                ConditionExpression: `attribute_not_exists(${await this.keys(0)})`,
                Item: input
            })

            await this.client.send(command)

            return input
        }
    }

    async delete(input: string): Promise<Model>
    async delete(input: string[]): Promise<Model[]>
    async delete(input: string|string[]): Promise<Model|Model[]> {
        if (Array.isArray(input)) {
            const items = await this.get(input)
            const key = await this.keys(0)
            const command = new BatchWriteCommand({
                RequestItems: {
                    [this.tableName]: input.map(item => ({
                        DeleteRequest: {
                            Key: {
                                [key]: item
                            }
                        }
                    }))
                }
            })

            await this.client.send(command)

                return items
        } else {
            const command = new DeleteCommand({
                TableName: this.tableName,
                Key: {
                    [await this.keys(0)]: input
                },
                ReturnValues: "ALL_OLD"
            })
            const { Attributes } = await this.client.send(command)
        
            return Attributes as Model
        }
    }

    async update(key: string, newprops: Partial<Model>): Promise<Model> {
        const generator = new DynamoDBGenerator(newprops)
        const command = new UpdateCommand({ 
            TableName: this.tableName, 
            ReturnValues: "ALL_NEW",
            ExpressionAttributeNames: generator.AttributeNames(),
            ExpressionAttributeValues: generator.AttributeValues(),
            UpdateExpression: generator.UpdateExpression(),
            ConditionExpression: `attribute_exists(${await this.keys(0)})`,
            Key: { 
                [await this.keys(0)]: key
            }
        })
        const { Attributes } = await this.client.send(command)

        return Attributes as Model
    }

    async initialize(keys: Keys): Promise<string> {
        const generator = new DynamoDBGenerator()
        const command = new CreateTableCommand({
            BillingMode: "PAY_PER_REQUEST",
            TableName: this.tableName,
            KeySchema: generator.TableDefinitions(keys).KeySchema, 
            AttributeDefinitions: generator.TableDefinitions(keys).AttributeDefinitions
        })
        const { TableDescription } = await this.client.send(command)

        if (!TableDescription) {
            return "An error occurred."
        }
        
        return `Table "${TableDescription.TableName}" created succsessfully`
    }

    async purge(): Promise<string> {
        const items = await this.all()
        const key = await this.keys(0)
        const command = new BatchWriteCommand({
            RequestItems: {
                [this.tableName]: items.map(item => ({
                    DeleteRequest: {
                        Key: {
                            [key]: item[key]
                        }
                    }
                }))
            }
        })

        try {
            await this.client.send(command)

            return `Every element (${items.length.toString()}) on Table: "${this.tableName}" has been deleted successfully.`
        } catch (error) {
            return "An error occurred."
        }
    }

    async drop(): Promise<string> {
        const command = new DeleteTableCommand({
            TableName: this.tableName
        })
        const { TableDescription } = await this.client.send(command)

        if (!TableDescription) {
            return "An error occurred."
        }

        return `Table "${TableDescription.TableName}" deleted.`
    }
}