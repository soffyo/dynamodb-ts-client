import { DynamoDBGenerator, Attributes, Keys } from "../src/generator"

class Color {
    name: string
    tone: "dark"|"light"
    of?: string[]
}

const attributes: Attributes = {
    first: "a test prop",
    some: "another test prop",
    last: "another another test prop"
}
const keys: Keys<Color> = {
    PartitionKey: {
        Name: "name",
        Type: "S"
    },
    SortKey: {
        Name: "tone",
        Type: "S"
    }
}

test('AttributeNames', () => {
    const AttributeNames = DynamoDBGenerator.attributeNames(attributes)
    
    expect(AttributeNames).toStrictEqual({
        "#first": "first",
        "#some": "some",
        "#last": "last"
    })
})


test('AttributeValues', () => {
    const AttributeValues = DynamoDBGenerator.attributeValues(attributes)

    expect(AttributeValues).toStrictEqual({
        ":first": attributes.first,
        ":some": attributes.some,
        ":last": attributes.last
    })
})

test('UpdateExpression', () => {
    const Expression = DynamoDBGenerator.updateExpression(attributes)

    expect(Expression).toBe("SET #first = :first,#some = :some,#last = :last")
})

test('KeySchema', () => {
    const KeySchema = DynamoDBGenerator.keySchema(keys)

    expect(KeySchema).toStrictEqual([
        {
            AttributeName: keys.PartitionKey.Name,
            KeyType: "HASH"
        },
        {
            AttributeName: keys.SortKey.Name,
            KeyType: "RANGE"
        }  
    ])
})

test('AttributeDefinitions', () => {
    const AttributeDefinitions = DynamoDBGenerator.attributeDefinitions(keys)

    expect(AttributeDefinitions).toStrictEqual([
        {
            AttributeName: keys.PartitionKey.Name,
            AttributeType: keys.PartitionKey.Type
        },
        {
            AttributeName: keys.SortKey.Name,
            AttributeType: keys.SortKey.Type
        }
    ])
})

