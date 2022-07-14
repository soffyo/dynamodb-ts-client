import { isObject } from "../src/utilities"
import { ConditionsObject, ConditionalOperator, StringOperator } from "../src/types"
import { attributeNames } from "../src/generator"

class obj {
    name: string
    map?: {
        map_name: string,
        map_id?: number,
        firstchild?: {
            first_name: string,
            first_id?: number,
            secondchild?: {
                second_name: string,
                second_id?: number
            }
        }
    }
}

const example: obj = {
    name: "Name",
    map: {
        map_name: "MapName",
        map_id: 0,
        firstchild: {
            first_name: "FirstName",
            first_id: 1,
            secondchild: {
                second_name: "SecondName",
                second_id: 2
            }
        }
    }
}

const conditions: ConditionsObject<obj> = {
    name: { "=": "name" },
    map: {
        map_name: { contains: "MapName" },
        map_id: { between: [0,2] },
        firstchild: {
            first_name: { begins_with: "FirstName" },
            first_id: { size: { "<=": 10 } },
            secondchild: {
                second_name: { ">": "SecondName" },
                second_id: { ">=": 2 }
            }
        }
    }
} 

const update = {
    name: "updated_name",
    a: 1,
    b: 2,
    c: 3,
    map: {
        map_name: "updated_MapName",
        map_id: 10,
        firstchild: {
            first_name: "updated_FirstName",
            first_id: 11,
            secondchild: {
                second_name: "updated_SecondName",
                second_id: 22
            }
        }
    }
}

test("propsToArr", () => {
    console.log(attributeNames(propsToArr(update)))
})

test("attrVal", () => {
    console.log(conditionAttributeValues(conditions))
})

test("conditionExp", () => {
    console.log(conditionExpression(conditions))
})

function conditionAttributeValues<T>(obj: ConditionsObject<T>, marker = "_condition"): Record<string,Exclude<any,{}>> { 
    let values = {}
    const operators = ["between", "BETWEEN", "contains", "begins_with", "size", "=", "<", "<=", ">", ">="]
    const addPath = (a, b) => a ? `${a}.${b}` : b
    void (function iterate(obj = {}, head = '') {
        Object.entries(obj).reduce((a: any, [key, value]) => {
            let path = !operators.includes(key) ? addPath(head, key) : head
            if (isObject(value) && key !== "size") {
                return iterate(value as {}, path)
            } else {
                switch (key) {
                    case "BETWEEN":
                    case "between":
                        if (Array.isArray(value)) {
                            values = { 
                                ...values, 
                                [`:${path}1${marker}`]: value[0],
                                [`:${path}2${marker}`]: value[1] 
                            }
                        } 
                        break
                    case "size": 
                        const operator = Object.keys(obj[key])[0]
                        values = {
                            ...values,
                            ":size_dynamoDbOperator": obj[key][operator]
                        }
                        break
                    default: values = { ...values, [`:${path}${marker}`]: value }
                }
            }
        }, [])
    })(obj)
    return values
}

function conditionExpression(obj: Record<string,any>, marker: string = "_condition") {
    const operators = ["between", "BETWEEN", "contains", "begins_with", "size", "=", "<", "<=", ">", ">="]
    const expressions: string[] = []
    const addPath = (a: string, b: string) => a ? `${a}.${b}` : b
    void (function iterate(obj, head = "") {
        Object.entries(obj).reduce((a: any, [key, value]) => {
            let path = !operators.includes(key) ? addPath(head, key) : head
            if (isObject(value) && key !== "size") {
                return iterate(value, path)
            } else {
                const path_ = path.split(".").join(".#")
                switch (key) {
                    case "between":
                    case "BETWEEN": expressions.push(`(#${path_} ${key.toUpperCase()} :${path}1${marker} AND :${path}2${marker})`) 
                        break
                    case "contains":
                    case "begins_with": expressions.push(`(${key}(#${path_}, :${path}${marker}))`)
                        break
                    case "size": 
                        const operator = Object.keys(obj[key])[0]
                        expressions.push(`(${key}(#${path_} ${operator} :size_dynamoDbOperator)`)
                        break
                    default: expressions.push(`(#${path_} ${key} :${path}${marker})`)
                        break
                }
            }
        }, [])
    })(obj)
    return expressions.join(" AND ")
}

function propsToArr(obj) { 
    const attributes: string[] = []
    void (function add(obj) {
        for (const [k,v] of Object.entries(obj)) {
            attributes.push(k)
            if (isObject(v)) {
                add(v)
            }
        }
    })(obj)
    return attributes
}