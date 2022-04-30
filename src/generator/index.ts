import { Keys } from "../index"

type DynamoDBGeneratorProps = Record<string, Exclude<any,object>>
type AttributeValue = `:_${string}_`
type AttributeValues = Record<AttributeValue, any>
type AttributeName = `#_${string}_`
type AttributeNames = Record<AttributeName, string>
type UpdateExpression = `${AttributeName} = ${AttributeValue}`

interface KeySchema { 
    AttributeName: string
    KeyType: "HASH"|"RANGE"
}

interface AttributeDefinitions {
    AttributeName: string
    AttributeType: "S"|"N"|"B"
}

interface TableDefinitions { 
    KeySchema: KeySchema[], 
    AttributeDefinitions: AttributeDefinitions[]
}

export class DynamoDBGenerator {
    private readonly input: DynamoDBGeneratorProps

    constructor(input?: DynamoDBGeneratorProps) {
        if (input != undefined ) {
            this.input = input
        }
    }
    
    AttributeValues(): AttributeValues {
        if (this.input) {
            let AttributeValues: AttributeValues

            for (const [key, value] of Object.entries(this.input)) {
                AttributeValues = { ...AttributeValues, [`:_${key}_`]: value }
            }

            return AttributeValues
        } else {
            throw new Error("When using this method, you must pass props to the constructor")
        }
    }

    AttributeNames(): AttributeNames {
        if (this.input) {
            let AttributeNames: AttributeNames

            for (const key in this.input) {
                AttributeNames = { ...AttributeNames, [`#_${key}_`]: key }
            }
            
            return AttributeNames
        } else {
            throw new Error("When using this method, you must pass props to the constructor")
        }
    }

    UpdateExpression(): string {
        if (this.input) {
            let Expressions: Array<UpdateExpression> = []

            for (const key in this.input) {
                Expressions.push(`#_${key}_ = :_${key}_`)
            }

            return `SET ${[Expressions]}`
        } else {
            throw new Error("When using this method, you must pass props to the constructor")
        }
    }

    TableDefinitions(keys: Keys): TableDefinitions {
        let KeySchema: KeySchema[] = []
        let AttributeDefinitions: AttributeDefinitions[] = []

        if (keys.PartitionKey) {
            KeySchema.push({
                AttributeName: keys.PartitionKey,
                KeyType: "HASH"
            })

            AttributeDefinitions.push({
                AttributeName: keys.PartitionKey,
                AttributeType: "S"
            })
        }

        if (keys.SortKey) {
            KeySchema.push({
                AttributeName: keys.SortKey,
                KeyType: "RANGE"
            })

            AttributeDefinitions.push({
                AttributeName: keys.SortKey,
                AttributeType: "S"
            })
        }

        return { KeySchema, AttributeDefinitions }
    }
}