import { ConditionalOperator } from "../types"
import { convertOperator } from "./operator"
import { isObject } from "../utilities"
import { operators } from "../operators"

export function updateExpression(input: Record<string,any>): string {
    const updates: Array<string> = []
    const adds: Array<string> = []
    const deletes: Array<string> = []
    const removes: Array<string> = []
    const addPath = (a: string, b: string) => a ? `${a}_dynamoDBSeparator_${b}` : b
    void (function iterate(obj = {}, head = "") {
        Object.entries(obj).reduce((a: any, [key, value]) => {
            if (value.ADD) {
                adds.push(`#${key} :${key}_dynamoDB_ADD`)
            } else if (value.DELETE) {
                deletes.push(`DELETE #${key} :${key}_dynamoDB_DELETE`)
            } else {
                let path = !operators.includes(key as ConditionalOperator) ? addPath(head, key) : head
                if (isObject(value) && key !== "SIZE") {
                    return iterate(value, path)
                } else {
                    const path_ = path.split("_dynamoDBSeparator_").join(".#")
                    if (value == "__removeDynamoDBAttribute") {
                        removes.push(`#${path_}`)
                    } else {
                        updates.push(`#${path_} = :${path}`)
                    }
                }
            }
        }, [])
    })(input)
    const rm = removes.length > 0 ? 'REMOVE ' + removes.join(', ') : ""
    const add = adds.length > 0 ? 'ADD ' + adds.join(', ') : ""
    const del = deletes.length > 0 ? deletes.join(' ') : ""
    return `SET ${updates.join(', ')} ${add} ${del} ${rm}`
}

export function conditionExpression(obj: Record<string,any>, marker: string = "_condition") {
    const expressions: string[] = []
    const addPath = (a: string, b: string) => a ? `${a}_dynamoDBSeparator_${b}` : b
    void (function iterate(obj = {}, head = "") {
        Object.entries(obj).reduce((a: any, [key, value]) => {
            let path = !operators.includes(key as ConditionalOperator) ? addPath(head, key) : head
            if (isObject(value) && key !== "SIZE") {
                return iterate(value, path)
            } else {
                key = convertOperator(key)
                const path_ = path.split("_dynamoDBSeparator_").join(".#")
                switch (key) {
                    case "BETWEEN": expressions.push(`(#${path_} BETWEEN :${path}1${marker} AND :${path}2${marker})`) 
                        break
                    case "IN":
                        const values = []
                        value.forEach((item, index) => {
                            values.push(`:${path}_${index}_in_${marker}`)
                        })
                        expressions.push(`(#${path_} IN (${values.join(", ")}))`)
                        break
                    case "CONTAINS":
                    case "BEGINS_WITH": expressions.push(`(${key.toLowerCase()}(#${path_}, :${path}${marker}))`)
                        break
                    case "SIZE": 
                        const operator = convertOperator(Object.keys(obj[key])[0])
                        expressions.push(`(size(#${path_}) ${operator} :${path}_size_dynamoDbOperator)`)
                        break
                    case "ATTRIBUTE_EXISTS":
                        if (value) {
                            expressions.push(`(attribute_exists(#${path_}))`)
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