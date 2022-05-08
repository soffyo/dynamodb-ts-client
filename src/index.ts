import { 
    DynamoDBClient, 
    DynamoDBClientConfig, 
    DescribeTableCommand,
    CreateTableCommand,
    DeleteTableCommand,
    BillingMode
} from "@aws-sdk/client-dynamodb"
import { 
    DynamoDBDocumentClient, 
    GetCommand, 
    PutCommand,
    DeleteCommand,
    UpdateCommand, 
    ScanCommand,
    ScanCommandOutput,
    BatchWriteCommand,
    BatchGetCommand
} from "@aws-sdk/lib-dynamodb"
import { NativeAttributeValue, NativeScalarAttributeValue } from "@aws-sdk/util-dynamodb";
import { DynamoDBGenerator, Keys } from "./generator"

interface DynamoDBArgs {
    TableName: string
    Config?: DynamoDBClientConfig
}

interface UpdateInput<T> {
    Key: Partial<T>
    Update: Partial<T>
}

interface PrimaryKeys {
    PartitionKey: NativeScalarAttributeValue
    SortKey?: NativeScalarAttributeValue
}

interface InitConfig<T> {
    Keys: Keys<T>
    BillingMode?: BillingMode
}

export class DynamoDB<Model extends Record<string,NativeAttributeValue>> {
    private readonly table: string
    private readonly dynamodb: DynamoDBClient
    private readonly client: DynamoDBDocumentClient

    constructor({ TableName, Config = { region: process.env.AWS_REGION } }: DynamoDBArgs) {
        this.table = TableName 
        this.dynamodb = new DynamoDBClient(Config)
        this.client = DynamoDBDocumentClient.from(this.dynamodb)
    }

    private async keys(): Promise<PrimaryKeys> {
        const command = new DescribeTableCommand({ TableName: this.table })
        const { Table } = await this.client.send(command)
        let Keys: PrimaryKeys = { PartitionKey: Table.KeySchema[0].AttributeName }
        if (Table.KeySchema[1] !== undefined && Table.KeySchema[1] !== null) {
            Keys = { ...Keys, SortKey: Table.KeySchema[1].AttributeName }
        }
        return Keys
    }

    async initialize({ Keys, BillingMode = "PAY_PER_REQUEST" }: InitConfig<Model>): Promise<string> {
        const command = new CreateTableCommand({
            BillingMode,
            TableName: this.table,
            KeySchema: DynamoDBGenerator.keySchema<Model>(Keys),
            AttributeDefinitions: DynamoDBGenerator.attributeDefinitions<Model>(Keys)
        })
        const { TableDescription } = await this.client.send(command)
        return `Table "${TableDescription.TableName}" created successfully`
    }

    async all(): Promise<Model[]> {
        async function scanAll(scan: ScanCommandOutput) {
            let Items: Model[] = scan.Items as Model[]
            if (scan.LastEvaluatedKey) {
                const command = new ScanCommand({
                    TableName: this.tableName,
                    ExclusiveStartKey: scan.LastEvaluatedKey
                })
                const newscan: ScanCommandOutput = await this.client.send(command)
                newscan.Items.forEach((item: Model) => Items.push(item))
                return scanAll(newscan)
            }
            return Items
        }
        const command = new ScanCommand({ TableName: this.table })
        const scan = await this.client.send(command)
        return await scanAll(scan) as Model[]
    }

    async get(input: Partial<Model>): Promise<Model>
    async get(input: Partial<Model>[]): Promise<Model[]>
    async get(input: Partial<Model>[]|Partial<Model>): Promise<Model[]|Model> {
        if (Array.isArray(input)) {
            const command = new BatchGetCommand({
                RequestItems: {
                    [this.table]: {
                        Keys: input
                    }
                }
            })
            const { Responses } = await this.client.send(command)
            return Responses[this.table] as Model[]
        } else {
            const command = new GetCommand({ 
                TableName: this.table, 
                Key: input
            })
            return (await this.client.send(command)).Item as Model[]
        }
    } 

    async put(input: Model): Promise<Model>
    async put(input: Model[]): Promise<Array<Model>>
    async put(input: Model[]|Model): Promise<Model[]|Model> {
        const { PartitionKey, SortKey } = await this.keys()
        const attributes = { 
            [PartitionKey as string]: PartitionKey,
            [SortKey as string]: SortKey
        }
        const conditionExpression = (): string => {
            let expression = `attribute_not_exists (#${PartitionKey})`
            if (SortKey !== undefined) {
                expression = expression + ` AND attribute_not_exists (#${SortKey})`
            }
            return expression
        }
        if (Array.isArray(input)) {
            const command = new BatchWriteCommand({ 
                RequestItems: {
                    [this.table]: input.map((Item: Model) => ({ 
                        PutRequest: { 
                            Item,
                            ExpressionAttributeNames: DynamoDBGenerator.attributeNames(attributes),
                            ConditionExpression: conditionExpression(), 
                        } 
                    }))
                }
            })
            try {
                await this.client.send(command)
                return input
            } catch (error) {
                throw new Error("Something went wrong trying to put the items!")
            }
        } else {
            const command = new PutCommand({
                TableName: this.table,
                ExpressionAttributeNames: DynamoDBGenerator.attributeNames(attributes),
                ConditionExpression: conditionExpression(),
                Item: input
            })
            try {
                await this.client.send(command)
                return input
            } catch (error) {
                throw new Error("Something went wrong trying to put the item!")
            }
        }
    }

    async delete(input: Partial<Model>): Promise<Model>
    async delete(input: Partial<Model>[]): Promise<Model[]>
    async delete(input: Partial<Model>[]|Partial<Model>): Promise<Model[]|Model> {
        if (Array.isArray(input)) {
            const items = await this.get(input)
            const command = new BatchWriteCommand({
                RequestItems: {
                    [this.table]: input.map((item: Partial<Model>) => ({
                        DeleteRequest: {
                            Key: item
                        }
                    }))
                }
            })
            try {
                await this.client.send(command)
                return items
            } catch (error) {
                throw new Error("Something went wrong trying to delete the items!")
            }
        } else {
            const command = new DeleteCommand({
                TableName: this.table,
                Key: input,
                ReturnValues: "ALL_OLD"
            })
            return (await this.client.send(command)).Attributes as Model
        }
    }

    async update({ Key, Update }: UpdateInput<Model>): Promise<Model> {
        const { PartitionKey, SortKey } = await this.keys()
        const attributes = { 
            [PartitionKey as string]: PartitionKey,
            [SortKey as string]: SortKey
        }
        const conditionExpression = (): string => {
            let expression = `attribute_exists (#${PartitionKey})`
            if (SortKey !== undefined) {
                expression = expression + ` AND attribute_exists (#${SortKey})`
            }
            return expression
        }
        const command = new UpdateCommand({ 
            Key,
            TableName: this.table, 
            ReturnValues: "ALL_NEW",
            ExpressionAttributeNames: { 
                ...DynamoDBGenerator.attributeNames(Update), 
                ...DynamoDBGenerator.attributeNames(attributes)
            },
            ExpressionAttributeValues: DynamoDBGenerator.attributeValues(Update),
            UpdateExpression: DynamoDBGenerator.updateExpression(Update),
            ConditionExpression: conditionExpression()
        })
        return (await this.client.send(command)).Attributes as Model
    }

    /* async purge(): Promise<string> {
        const items = await this.all()
        const key = await this.keys(0)
        const command = new BatchWriteCommand({
            RequestItems: {
                [this.table]: items.map(item => ({
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
            return `Every element (${items.length.toString()}) on Table: "${this.table}" has been deleted successfully.`
        } catch (error) {
            return "An error occurred."
        }
    }
 */
    async drop(): Promise<string> {
        const command = new DeleteTableCommand({
            TableName: this.table
        })
        const { TableDescription } = await this.client.send(command)
        return `Table "${TableDescription.TableName}" deleted.`
    }
}