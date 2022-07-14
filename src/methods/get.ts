import { GetCommand, BatchGetCommand } from "@aws-sdk/lib-dynamodb"
import { Keys, TSClientMethodConfig } from "../types"
import { splitItems } from "../utilities"

export async function get<T>({ table, client }: TSClientMethodConfig, input: Keys<T>[]|Keys<T>): Promise<T[]|T> {
    if (Array.isArray(input)) {
        const Response = []
        const inputs = splitItems(input)
        for (const item of inputs) {
            const command = new BatchGetCommand({
                RequestItems: {
                    [table]: {
                        Keys: item
                    }
                }
            })
            const { Responses } = await client.send(command)
            Response.push(Responses[table])
        }
        return Response.flat() as T[]
    } else { 
        const command = new GetCommand({ 
            TableName: table, 
            Key: input
        })
        return (await client.send(command)).Item as T
    }
} 