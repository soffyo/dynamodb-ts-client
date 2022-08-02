import { BatchWriteCommand, PutCommand } from "@aws-sdk/lib-dynamodb"
import { splitItems } from "../utilities"
import { attributeNames, keys } from "../generator"
import { TSClientMethodConfig } from "../types"
import { checkReservedNames, checkMissingArg } from "../errors"

export async function put<T>({ table, client }: TSClientMethodConfig, input: T[]|T): Promise<T[]|T> {
    checkMissingArg(input, "At least one object to put must be provided.")
    checkReservedNames(input)
    const { PKName, SKName } = await keys({ table, client }) as { PKName: string, SKName: string }
    const names = [PKName, SKName]
    const conditionExpression = (): string => {
        let expression = `attribute_not_exists (#${PKName})`
        if (SKName !== undefined) {
            expression += ` AND attribute_not_exists (#${SKName})`
        }
        return expression
    }
    if (Array.isArray(input)) {
        const inputs = splitItems(input)
        for (const item of inputs) {
            const command = new BatchWriteCommand({ 
                RequestItems: {
                    [table]: item.map((Item: T) => ({ 
                        PutRequest: { Item } 
                    }))
                }
            })
            await client.send(command)
        }
        return input
    } else {
        const command = new PutCommand({
            TableName: table,
            ExpressionAttributeNames: attributeNames(names),
            ConditionExpression: conditionExpression(),
            Item: input
        })
        await client.send(command)
        return input
    }
}