import { DynamoDB } from "../src"

class Color {
    name: string
    of: string[]
    other?: {
        nested: string
    }
}

const table = "test_simple_table"
const db = new DynamoDB<Color>({ TableName: table, Config: {
    region: "eu-central-1",
    endpoint: "http://localhost:8000",
    credentials: {
        accessKeyId: "deoirjg",
        secretAccessKey: "sdfsfg"
    }
}})
const items: Color[] = [
    {
        name: "blue",
        of: ["night sky", "sea"],
        other: {
            nested: "sub blue"
        }
    },
    {
        name: "white",
        of: ["milk", "clouds"],
        other: {
            nested: "sub white",
        }
    },
    {
        name: "yellow",
        of: ["sunflowers"],
        other: {
            nested: "sub yellow",
        }
    }
]

test('Initialize Table', async function() {
    const init = await db.initialize({
        Keys: {
            PartitionKey: {
                Name: "name",
                Type: "S"
            }
        }
    })
    expect(init).toBe(`Table "${table}" created successfully`)
})

test('Put Single Item', async() => {
    const put = await db.put(items[0])
    expect(JSON.stringify(put)).toBe(JSON.stringify(items[0]))
})

test('Put Multiple Item', async() => {
    const put = await db.put([items[0], items[1], items[2]])
    expect(JSON.stringify(put)).toBe(JSON.stringify([items[0], items[1], items[2]]))
})

test('Get Single Item', async() => {
    const get = await db.get({ name: items[0].name })
    expect(get).toStrictEqual(items[0])
})

test('Get Multi Item', async() => {
    const get = await db.get([{ name: items[0].name }, { name: items[1].name }])
    expect(get[0].name).toBe(items[0].name)
    expect(get[0].of).toStrictEqual(items[0].of)
    expect(get[0].other).toStrictEqual(items[0].other)
    expect(get[1].name).toBe(items[1].name)
    expect(get[1].of).toStrictEqual(items[1].of)
    expect(get[1].other).toStrictEqual(items[1].other)
})

test('Get all items', async() => {
    const all = await db.all()
    expect(all.length).toBe(items.length)
})

test('Update', async() => {
    const update = await db.update({
        Key: { name: "blue" },
        Update: { of: ["ocean"], other: { nested: "sub blue updated" } }
    })
    expect(update.of).toStrictEqual(["ocean"])
    expect(update.other).toStrictEqual({ nested: "sub blue updated" })
})

test('Delete Single Item', async() => {
    const del = await db.delete({ name: "white" })
    expect(del).toStrictEqual(items[1])
})

test('Delete Multi', async() => {
    const del = await db.delete([{ name: "blue" }, {name: "yellow"}])
    expect(del.length).toBe(2)
})

test('Drop', async() => {
    const drop = await db.drop()
    expect(drop).toBe(`Table "${table}" deleted.`)
})