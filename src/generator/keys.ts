import { DescribeTableCommand } from "@aws-sdk/client-dynamodb"
import { TSClientMethodConfig, PrimaryKeys } from "../types"

export async function keys({ table, client }: TSClientMethodConfig): Promise<PrimaryKeys> {
    const command = new DescribeTableCommand({ TableName: table })
    const { Table } = await client.send(command)
    let Keys: PrimaryKeys = { PKName: Table.KeySchema[0].AttributeName }
    if (Table.KeySchema[1] !== undefined && Table.KeySchema[1] !== null) {
        Keys = { ...Keys, SKName: Table.KeySchema[1].AttributeName }
    }
    return Keys
}

export function key({ PKName, SKName }, input) {
    let Key = {
        [PKName]: input[PKName]
    }
    if (SKName) {
        Key = {
            ...Key,
            [SKName]: input[SKName]
        }
    }
    return Key
}