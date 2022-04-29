import { 
    DynamoDBClient, 
    DynamoDBClientConfig, 
    DescribeTableCommand,
    CreateTableCommand
} from "@aws-sdk/client-dynamodb"
import { 
    DynamoDBDocumentClient, 
    GetCommand, 
    PutCommand,
    DeleteCommand,
    UpdateCommand, 
    ScanCommand,
    GetCommandOutput,
    DeleteCommandOutput,
    UpdateCommandOutput, 
    ScanCommandOutput, 
    BatchWriteCommand
} from "@aws-sdk/lib-dynamodb"
import { DynamoDBGenerator } from "./generator"

interface Keys {
    PartitionKey: string
    SortKey?: string
}

interface DynamoDBArgs {
    TableName: string
    Config?: DynamoDBClientConfig
}

type Output<ItemType,CommandType,OmitType extends string> = Omit<CommandType, OmitType> & {[k in OmitType]?: ItemType}

export class DynamoDB<T> {
    private readonly TableName: string
    private readonly DynamoDB: DynamoDBClient
    private readonly DocumentClient: DynamoDBDocumentClient

    constructor({ TableName, Config = { region: process.env.AWS_REGION } }: DynamoDBArgs) {
        this.TableName = TableName 
        this.DynamoDB = new DynamoDBClient(Config)
        this.DocumentClient = DynamoDBDocumentClient.from(this.DynamoDB)
    }

    private async key(index: number): Promise<string> {
        const command = new DescribeTableCommand({ TableName: this.TableName })

        const { Table } = await this.DocumentClient.send(command)

        return Table.KeySchema[index].AttributeName
    }

    async all<ItemType = T>(Limit?: number): Promise<ItemType[]> {
        const command = new ScanCommand({
            TableName: this.TableName,
            Limit
        })

        const { Items } = await this.DocumentClient.send(command) as Output<ItemType[],ScanCommandOutput,"Items">

        return Items
    }

    async get<ItemType = T>(Key: string): Promise<ItemType> {
        const command = new GetCommand({ 
            TableName: this.TableName, 
            Key: { 
                [await this.key(0)]: Key
            } 
        })

        const { Item } = await this.DocumentClient.send(command) as Output<ItemType,GetCommandOutput,"Item">
    
        return Item
    }

    async put<ItemType = T>(Item: ItemType): Promise<ItemType> {
        const command = new PutCommand({
            TableName: this.TableName,
            ConditionExpression: `attribute_not_exists(${await this.key(0)})`,
            Item
        })

        try {
            await this.DocumentClient.send(command) 
            
            return Item
        } catch (error) {
            throw new Error("An error occurred")
        }
    }

    async delete<ItemType = T>(Key: string): Promise<ItemType> {
        const command = new DeleteCommand({
            TableName: this.TableName,
            Key: {
                [await this.key(0)]: Key
            },
            ReturnValues: "ALL_OLD"
        })

        const { Attributes } = await this.DocumentClient.send(command) as Output<ItemType,DeleteCommandOutput,"Attributes">
        
        return Attributes
    }

    async update<PropsType,ItemType = T>(Key: string, newprops: PropsType): Promise<ItemType> {
        const generator = new DynamoDBGenerator(newprops)

        const command = new UpdateCommand({ 
            TableName: this.TableName, 
            ReturnValues: "ALL_NEW",
            ExpressionAttributeNames: generator.AttributeNames(),
            ExpressionAttributeValues: generator.AttributeValues(),
            UpdateExpression: generator.UpdateExpression(),
            ConditionExpression: `attribute_exists(${await this.key(0)})`,
            Key: { 
                [await this.key(0)]: Key
            }
        })

        const { Attributes } = await this.DocumentClient.send(command) as Output<ItemType,UpdateCommandOutput,"Attributes">

        return Attributes
    }

    async purge(): Promise<string> {
        const items = await this.all<Record<string, any>>()

        const requests = items.map(async item => ({
            DeleteRequest: {
                Key: {
                    [await this.key(0)]: item[await this.key(0)]
                }
            }
        }))

        const command = new BatchWriteCommand({
            RequestItems: {
                [this.TableName]: requests
            }
        })

        try {
            await this.DocumentClient.send(command)

            return `Every element (${items.length.toString()}) on Table: "${this.TableName}" has been deleted successfully.`
        } catch (error) {
            return "An error occurred."
        }
    }

    async initialize(Keys: Keys): Promise<string> {
        const command = new CreateTableCommand({
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
        })

        const { TableDescription } = await this.DocumentClient.send(command)

        if (!TableDescription) {
            return "An error occurred."
        }
        
        return `Table "${TableDescription.TableName}" created succsessfully`
    }
}