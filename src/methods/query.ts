import { QueryCommand } from "@aws-sdk/lib-dynamodb"
import { hasOwnProperty } from "../utilities"
import { attributeNames, attributeValues, conditionExpression, keys } from "../generator"
import { Query, QueryInput, TSClientMethodConfig } from "../types"
import { checkMissingArg } from "../errors"

export async function query<T>({ table, client }: TSClientMethodConfig, input: QueryInput<T>|Query<T>): Promise<T[]> {
    checkMissingArg(input, "A query input must be provided.")
    const { PKName, SKName } = await keys({ table, client }) as { PKName: string, SKName: string }
    let names = [PKName]
    let attributes = { [PKName]: hasOwnProperty(input, "query") ? input.query[PKName] : input[PKName] }
    let expression = `#${PKName} = :${PKName}`
    if (SKName) {
        const SK = hasOwnProperty(input, "query") ? input.query[SKName] : input[SKName]
        const k = Object.keys(SK)[0]
        const v = SK[k]
        names.push(SKName)
        expression += ` AND ${conditionExpression({ [SKName]: SK }, "")}`
        if (Array.isArray(v) && k == "BETWEEN" || k == "between") {
            attributes = { ...attributes,
                [`${SKName}1`]: v[0],
                [`${SKName}2`]: v[1]
            }
        } else {
            attributes = { ...attributes, [SKName]: v }
        }
    }
    const command = new QueryCommand({
        TableName: table,
        ExpressionAttributeNames: attributeNames(names),
        ExpressionAttributeValues: attributeValues(attributes),
        KeyConditionExpression: expression,
        Limit: hasOwnProperty(input, "query") && hasOwnProperty(input, "limit") ? input.limit : undefined,
        ScanIndexForward: hasOwnProperty(input, "query") && hasOwnProperty(input, "ascending") ? input.ascending : undefined 
    }) 
    console.log(command)
    return (await client.send(command)).Items as T[]
}