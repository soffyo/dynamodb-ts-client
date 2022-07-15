import { Remove } from "../types"
import { ConditionalOperator, StringOperator } from "../types"

export const operators: (ConditionalOperator|StringOperator)[] = [
    "between", 
    "BETWEEN", 
    "IN",
    "in",
    "contains", 
    "begins_with", 
    "size", 
    "=", "equal", 
    "<", "lesser", 
    "<=", "lesser_equal",
    ">", "greater",
    ">=", "greater_equal",
    "attribute_exists",
    "attribute_type"
]

export function remove(): Remove {
    return "__removeDynamoDBAttribute"
}

