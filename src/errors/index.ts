import { operators } from "../operators"
import { isObject } from "../utilities"
import { ConditionalOperator } from "../types"

const error = new Error()
error.name = "DynamoDBTSClient Error"

export function checkKeySchema(keySchema) {
    const pk = keySchema.PartitionKey.Name
    const keys = []
    if (operators.includes(pk as ConditionalOperator)) {
        keys.push(`"${pk}"`)
    }
    if (keySchema.SortKey) {
        const sk = keySchema.SortKey.Name
        if (operators.includes(sk as ConditionalOperator)) {
            keys.push(`"${sk}"`)
        }
    }
    if (keys.length > 0) {
        error.message = `The following property names cannot be used: ${keys.join(", ")} because they are reserved names.`
        throw error
    }
}

export function checkReservedNames(obj: {}) {
    const keys = []
    void (function iterate(obj) {
        return Object.entries(obj).reduce((a, [k,v]) => {
            if (isObject(v)) {
                return iterate(v)
            } else {
                if (operators.includes(k as ConditionalOperator)) {
                    keys.push(`"${k}"`)
                }
            }
        }, [])
    })(obj)
    if (keys.length > 0) {
        error.message = `The following property names cannot be used: ${keys.join(", ")} because they are reserved names.`
        throw error
    }
}

export function checkMissingArg(arg: any, message?: string) {
    if (!arg) {
        error.message = `Missing argument${message && " - " + message}`
        throw error
    }
}