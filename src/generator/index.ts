type AttributeValue = `:_${string}_`
type AttributeName = `#_${string}_`
type AttributeValues = Record<AttributeValue, any>
type AttributeNames = Record<AttributeName, string>
type UpdateExpression = `${AttributeName} = ${AttributeValue}`

export class DynamoDBGenerator<PropsType = Record<string, Exclude<any,object>>> {
    private readonly props: Record<string, any>

    constructor(props: PropsType) {
        this.props = props
    }
    
    AttributeValues(): AttributeValues {
        let AttributeValues: AttributeValues

        for (const [key, value] of Object.entries(this.props)) {
            AttributeValues = { ...AttributeValues, [`:_${key}_`]: value }
        }

        return AttributeValues
    }

    AttributeNames(): AttributeNames {
        let AttributeNames: AttributeNames

        for (const key in this.props) {
            AttributeNames = { ...AttributeNames, [`#_${key}_`]: key }
        }
        
        return AttributeNames
    }

    UpdateExpression(): string {
        let Expressions: Array<UpdateExpression> = []

        for (const key in this.props) {
            Expressions.push(`#_${key}_ = :_${key}_`)
        }

        return `SET ${[Expressions]}`
    }
}