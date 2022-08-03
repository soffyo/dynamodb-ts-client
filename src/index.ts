import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"
import { CheckReservedKeys, CommandInput, TSClientMethodConfig, TSClientParams, Query, QueryInput, InitConfig, Keys, UpdateInput } from "./types"
import { create, query, scan, get, put, _delete, update, drop } from "./methods"
import { checkMissingArg } from "./errors"

export class DynamoDB<Model extends CheckReservedKeys<Model>> {
    private readonly config: TSClientMethodConfig
    public readonly client: DynamoDBDocumentClient

    constructor(private input: TSClientParams) {
        checkMissingArg(input.TableName, "TableName must be provided in order to initialize the client.")
        const dynamodb = new DynamoDBClient(input.Config)
        this.config = {
            table: input.TableName,
            client: DynamoDBDocumentClient.from(dynamodb)
        }
        this.client = this.config.client
    }

    async create({ Keys, BillingMode = "PAY_PER_REQUEST" }: InitConfig<Model>): Promise<string> {
        return await create<Model>(this.config, { Keys, BillingMode })
    }

    async scan(limit?: number): Promise<Model[]> {
        return await scan<Model>(this.config, limit)
    }

    async query(input: Query<Model>): Promise<Model[]>
    async query(input: QueryInput<Model>): Promise<Model[]>
    async query(input: Query<Model>|QueryInput<Model>): Promise<Model[]> {
        return await query<Model>(this.config, input)
    }

    async get(input: Keys<Model>): Promise<Model>
    async get(input: Keys<Model>[]): Promise<Model[]>
    async get(input: Keys<Model>[]|Keys<Model>): Promise<Model[]|Model> {
       return await get<Model>(this.config, input)
    } 

    async put(input: Model): Promise<Model>
    async put(input: Model[]): Promise<Array<Model>>
    async put(input: Model[]|Model): Promise<Model[]|Model> {
        return await put<Model>(this.config, input)
    }

    async delete(input: Keys<Model>): Promise<Model>
    async delete(input: Keys<Model>[]): Promise<Model[]>
    async delete(input: CommandInput<Model>): Promise<Model>
    async delete(input: Keys<Model>[] | Keys<Model> | CommandInput<Model>): Promise<Model[]|Model> {
        return await _delete<Model>(this.config, input)
    }

    async update(input: CommandInput<Model> & UpdateInput<Model>): Promise<Model> {
        return await update<Model>(this.config, input)
    }

    async drop(): Promise<string> {
        return await drop(this.config)
    }
}