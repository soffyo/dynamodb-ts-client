import { Remove, UpdateOperator } from "../types"
import { ConditionalOperator } from "../types"

export const operators: (ConditionalOperator|UpdateOperator)[] = [
    "ADD",
    "DELETE", 
    "BETWEEN", 
    "IN",
    "CONTAINS", 
    "BEGINS_WITH", 
    "SIZE", 
    "EQUAL", 
    "LESSER",  
    "LESSER_EQUAL",
    "GREATER",
    "GREATER_EQUAL",
    "ATTRIBUTE_EXISTS",
    "ATTRIBUTE_TYPE"
]

export function remove(): Remove {
    return "__removeDynamoDBAttribute"
}

