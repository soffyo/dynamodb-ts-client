import { ConditionsObject, ConditionalOperator } from "../types"
import { isObject } from "../utilities"
import { operators } from "../operators"
import { convertOperator } from "./operator"

export function attributeValues(obj: Record<string,any>): Record<string,Exclude<any,{}>> { 
    let values = {}
    const addPath = (a, b) => a ? `${a}_dynamoDBSeparator_${b}` : b
    void (function iterate(obj = {}, head = '') {
        Object.entries(obj).reduce((a: any, [key, value]) => {
            if (value.ADD || value.DELETE) {
                const k = Object.keys(value)[0]
                values = {
                    ...values,
                    [`:${key}_dynamoDB_${k.toUpperCase()}`]: value[k]
                }
            } else if (!operators.includes(key as ConditionalOperator)) {
                let path = addPath(head, key)
                if (isObject(value)) {
                    return iterate(value, path)
                } else {
                    values = {
                        ...values,
                        [`:${path}`]: value
                    }
                }
            } 
        }, [])
    })(obj)
    return values
}

export function attributeNames<T = any>(input: Array<keyof T>) {
    if (!input) {
        return
    }
    let names: Record<string, any>
    input.forEach(item => names = { ...names, [`#${String(item)}`]: item })
    return names
}

export function conditionAttributeValues<T>(obj: ConditionsObject<T>, marker = "_condition"): Record<string,Exclude<any,{}>> { 
    let values = {}
    const addPath = (a, b) => a ? `${a}_dynamoDBSeparator_${b}` : b
    void (function iterate(obj = {}, head = '') {
        Object.entries(obj).reduce((a: any, [key, value]) => {
            let path = !operators.includes(key as ConditionalOperator) ? addPath(head, key) : head
            if (isObject(value) && key !== "SIZE") {
                return iterate(value as {}, path)
            } else {
                switch (key) {
                    case "BETWEEN":
                        if (Array.isArray(value)) {
                            values = { 
                                ...values, 
                                [`:${path}1${marker}`]: value[0],
                                [`:${path}2${marker}`]: value[1] 
                            }
                        } 
                        break
                    case "IN":
                        if (Array.isArray(value)) {
                            value.forEach((item, index) => {
                                values = {
                                    ...values,
                                    [`:${path}_${index}_in_${marker}`]: value[index]
                                }
                            })
                        }
                        break
                    case "SIZE": 
                        const operator = Object.keys(obj[key])[0]
                        values = {
                            ...values,
                            [`:${path}_size_dynamoDbOperator`]: obj[key][operator]
                        }
                        break
                    case "ATTRIBUTE_EXISTS": 
                        values = { ...values }
                        break
                    default: values = { ...values, [`:${path}${marker}`]: value }
                }
            }
        }, [])
    })(obj)
    return values
}