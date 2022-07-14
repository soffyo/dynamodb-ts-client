import { DeleteTableCommand } from "@aws-sdk/client-dynamodb"
import { TSClientMethodConfig } from "../types"

export async function drop({ table, client }: TSClientMethodConfig): Promise<string> {
    const command = new DeleteTableCommand({
        TableName: table
    })
    const { TableDescription } = await client.send(command)
    return `Table "${TableDescription.TableName}" deleted.`
}