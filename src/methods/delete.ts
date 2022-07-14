import { BatchWriteCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb"
import { objectKeys, hasOwnProperty, splitItems, propsToArray } from "../utilities"
import { Keys, CommandInput, TSClientMethodConfig } from "../types"
import { conditionAttributeValues, attributeNames, conditionExpression, key, keys } from "../generator"
import { get } from "./get"

export async function _delete<T>({ table, client }: TSClientMethodConfig, input: Keys<T>[] | Keys<T> | CommandInput<T>): Promise<T[]|T> {
    if (Array.isArray(input)) {
        const items = await get<T>({ table, client }, input)
        const inputs = splitItems(input)
        for (const item of inputs) {
            const command = new BatchWriteCommand({
                RequestItems: {
                    [table]: item.map((i: Keys<T>) => ({
                        DeleteRequest: {
                            Key: i
                        }
                    }))
                }
            })
            await client.send(command)
        }
        return items
    } else {
        const { PKName, SKName } = await keys({ table, client })
        const command = new DeleteCommand({
            TableName: table,
            Key: hasOwnProperty(input, "key") ? input.key : key({ PKName, SKName }, input),
            ReturnValues: "ALL_OLD",
            ExpressionAttributeValues: hasOwnProperty(input, "condition") ? conditionAttributeValues(input.condition) : undefined,
            ExpressionAttributeNames: hasOwnProperty(input, "condition") ? attributeNames(propsToArray(input.condition)) : undefined,
            ConditionExpression: hasOwnProperty(input, "condition") ? conditionExpression(input.condition) : undefined
        })
        return (await client.send(command)).Attributes as T
    }
}