import { UpdateCommand } from "@aws-sdk/lib-dynamodb"
import { propsToArray } from "../utilities"
import { TSClientMethodConfig, CommandInput, UpdateInput } from "../types"
import { attributeNames, attributeValues, keys, conditionExpression, conditionAttributeValues, updateExpression } from "../generator"
import { checkMissingArg } from "../errors"

export async function update<T>({ table, client }: TSClientMethodConfig, input: CommandInput<T> & UpdateInput<T>): Promise<T> {
    checkMissingArg(input.key, "Key/s for the item to update must be provided.")
    checkMissingArg(input.update, "Update input must be provided.")
    const { PKName, SKName } = await keys({ table, client }) as  { PKName: string, SKName: string }
    const names = [PKName]
    const defaultConditionExpression = (): string => {
        let expression = `attribute_exists(#${PKName})`
        if (SKName !== undefined) {
            expression += ` AND attribute_exists(#${SKName})`
        }
        if (input.condition) {
            expression += ` AND ${conditionExpression(input.condition)}`
        }
        return expression
    }
    if (SKName != undefined && SKName != null) {
        names.push(SKName)
    }
    const command = new UpdateCommand({ 
        Key: input.key,
        TableName: table, 
        ReturnValues: "ALL_NEW",
        ExpressionAttributeNames: !input.condition ? attributeNames([ ...propsToArray(input.update), ...names ]) : attributeNames([ ...propsToArray(input.update), ...propsToArray(input.condition), ...names ]),
        ExpressionAttributeValues: !input.condition ? attributeValues(input.update) : { ...attributeValues(input.update), ...conditionAttributeValues(input.condition) },
        UpdateExpression: updateExpression(input.update),
        ConditionExpression: defaultConditionExpression()
    })
    console.log(command)
    return (await client.send(command)).Attributes as T
}