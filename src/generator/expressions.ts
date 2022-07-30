import { ConditionalOperator, StringOperator } from "../types"
import { convertOperator } from "./operator"
import { isObject } from "../utilities"
import { operators } from "../operators"

export function updateExpression(input: Record<string,any>): string {
    if (!input) {
        return null
    }
    const updates: Array<string> = []
    const removes: Array<string> = []
    const addPath = (a: string, b: string) => a ? `${a}_dynamoDBSeparator_${b}` : b
    void (function iterate(obj = {}, head = "") {
        Object.entries(obj).reduce((a: any, [key, value]) => {
            let path = !operators.includes(key as ConditionalOperator|StringOperator) ? addPath(head, key) : head
            if (isObject(value) && key !== "size") {
                return iterate(value, path)
            } else {
                const path_ = path.split("_dynamoDBSeparator_").join(".#")
                if (value == "__removeDynamoDBAttribute") {
                    removes.push(`#${path_}`)
                } else {
                    updates.push(`#${path_} = :${path}`)
                }
            }
        }, [])
    })(input)
    return `SET ${updates.join(', ')} ${removes.length > 0 ? 'REMOVE ' + removes.join(', ') : ""}`
}

export function conditionExpression(obj: Record<string,any>, marker: string = "_condition") {
    const expressions: string[] = []
    const addPath = (a: string, b: string) => a ? `${a}_dynamoDBSeparator_${b}` : b
    void (function iterate(obj = {}, head = "") {
        Object.entries(obj).reduce((a: any, [key, value]) => {
            let path = !operators.includes(key as ConditionalOperator|StringOperator) ? addPath(head, key) : head
            if (isObject(value) && key !== "size") {
                return iterate(value, path)
            } else {
                key = convertOperator(key)
                const path_ = path.split("_dynamoDBSeparator_").join(".#")
                switch (key) {
                    case "between":
                    case "BETWEEN": expressions.push(`(#${path_} ${key.toUpperCase()} :${path}1${marker} AND :${path}2${marker})`) 
                        break
                    case "in":
                    case "IN":
                        const values = []
                        value.forEach((item, index) => {
                            values.push(`:${path}_${index}_in_${marker}`)
                        })
                        expressions.push(`(#${path_} ${key.toUpperCase()} (${values.join(", ")}))`)
                        break
                    case "contains":
                    case "begins_with": expressions.push(`(${key}(#${path_}, :${path}${marker}))`)
                        break
                    case "size": 
                        const operator = Object.keys(obj[key])[0]
                        expressions.push(`(${key}(#${path_} ${operator} :size_dynamoDbOperator)`)
                        break
                    case "attribute_exists":
                        if (value) {
                            expressions.push(`(${key}(#${path_}))`)
                        } else {
                            expressions.push(`(attribute_not_exists(#${path_}))`)
                        }
                        break
                    default: expressions.push(`(#${path_} ${key} :${path}${marker})`)
                        break
                }
            }
        }, [])
    })(obj)
    return expressions.join(" AND ")
}