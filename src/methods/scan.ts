import { ScanCommand, ScanCommandOutput } from "@aws-sdk/lib-dynamodb"
import { TSClientMethodConfig } from "../types"

export async function scan<T>({ table, client }: TSClientMethodConfig, limit?: number): Promise<T[]> {
    const Limit = limit ? limit : undefined
    const command = new ScanCommand({ TableName: table, Limit })
    const scan = await client.send(command)
    return await scanAll({ table, client }, scan) as T[]
}

async function scanAll<T>({ table, client }: TSClientMethodConfig, scan: ScanCommandOutput) {
    let Items: T[] = scan.Items as T[]
    if (scan.LastEvaluatedKey) { 
        const command = new ScanCommand({
            TableName: table,
            ExclusiveStartKey: scan.LastEvaluatedKey
        })
        const newscan: ScanCommandOutput = await client.send(command)
        newscan.Items.forEach((item: T) => Items.push(item))
        return await scanAll({ table, client }, newscan)
    }
    return Items
}