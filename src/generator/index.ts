import { AttributeDefinition, KeySchemaElement, ScalarAttributeType } from "@aws-sdk/client-dynamodb"
import { NativeAttributeValue } from "@aws-sdk/util-dynamodb"

export type Attributes = Record<string, NativeAttributeValue>

type AttributeValue = `:${string}`
type AttributeName = `#${string}`

type UpdateExpression = `${AttributeName} = ${AttributeValue}`

export interface Keys<T> {
    PartitionKey: {
        Name: T extends Record<string,NativeAttributeValue> ? keyof T : string 
        Type: ScalarAttributeType
    },
    SortKey?: {
        Name: T extends Record<string,NativeAttributeValue> ? keyof T : string 
        Type: ScalarAttributeType
    }
}

export class DynamoDBGenerator {    
    static attributeValues(attributes: Attributes): Record<AttributeValue, any> {
        if (attributes) {
            let AttributeValues: Record<AttributeValue, any>
            for (const [key, value] of Object.entries(attributes)) {
                AttributeValues = { ...AttributeValues, [`:${key}`]: value }
            }
            return AttributeValues
        } else {
            throw new Error("When using this method, you must pass props to the constructor")
        }
    }

    static attributeNames(attributes: Attributes): Record<AttributeName, string> {
        if (attributes) {
            let AttributeNames: Record<AttributeName, string>
            for (const key in attributes) {
                if (key !== "undefined" && key !== "null") {
                    AttributeNames = { ...AttributeNames, [`#${key}`]: key }
                }
            }
            return AttributeNames
        } else {
            throw new Error("When using this method, you must pass props to the constructor")
        }
    }

    static updateExpression(attributes: Attributes): string {
        if (attributes) {
            let Expressions: Array<UpdateExpression> = []
            for (const key in attributes) {
                if (key !== "undefined" && key !== "null") {
                    Expressions.push(`#${key} = :${key}`)
                }
            }
            return `SET ${[Expressions]}`
        } else {
            throw new Error("DynamoDBGenerator: When using updateExpression() method, you must pass the \"attributes\" prop to the constructor")
        }
    }

    static keySchema<Model extends Record<string,any>>(keys: Keys<Model>): KeySchemaElement[] {
        if (keys) {
            let KeySchema: KeySchemaElement[] = [{
                AttributeName: keys.PartitionKey.Name,
                KeyType: "HASH"
            }]    
            if (keys.SortKey) {
                KeySchema.push({
                    AttributeName: keys.SortKey.Name,
                    KeyType: "RANGE"
                })
            }
            return KeySchema
        } else throw new Error("DynamoDBGenerator: You must define the \"keys\" property in the class constructor initialization to use this method")
    }

    static attributeDefinitions<Model extends Record<string,any>>(keys: Keys<Model>): [AttributeDefinition, AttributeDefinition?]  {
        if (keys) {
            let AttributeDefinitions: [AttributeDefinition, AttributeDefinition?] = [{
                AttributeName: keys.PartitionKey.Name,
                AttributeType: keys.PartitionKey.Type
            }]    
            if (keys.SortKey) {
                AttributeDefinitions.push({
                    AttributeName: keys.SortKey.Name,
                    AttributeType: keys.SortKey.Type
                })
            }
            return AttributeDefinitions
        } else throw new Error("DynamoDBGenerator: You must define the \"keys\" property in the class constructor initialization to use this method")
    }
}