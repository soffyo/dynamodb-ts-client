import { Remove } from "../types"
import { ConditionalOperator, StringOperator } from "../types"

export const operators: (ConditionalOperator|StringOperator)[] = [
    "between", 
    "BETWEEN", 
    "contains", 
    "begins_with", 
    "size", 
    "=", "equal", 
    "<", "lesser", 
    "<=", "lesser_equal",
    ">", "greater",
    ">=", "greater_equal"
]

export function remove(): Remove {
    return "__removeDynamoDBAttribute"
}

