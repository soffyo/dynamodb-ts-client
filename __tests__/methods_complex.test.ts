import { DynamoDB } from "../src"

class Color {
    name: string
    tone: "dark"|"light"
    of?: string[]
}

const table = "test_complex_table"
const db = new DynamoDB<Color>({ 
    TableName: table, 
    Config: {
        region: "eu-central-1",
        endpoint: "http://localhost:8000",
        credentials: {
            accessKeyId: "accessKey",
            secretAccessKey: "secretKey"
        }
    } 
})
const items: Color[] = [
    {
        name: "blue",
        tone: "dark",
        of: ["night sky", "deep sea"]
    },
    {
        name: "blue",
        tone: "light",
        of: ["day sky", "clouds"]
    },
    {
        name: "yellow",
        tone: "light",
        of: ["sunflowers"]
    }
]

test("Initialize table", async() => {
    const init = await db.initialize({
        Keys: {
            PartitionKey: {
                Name: "name",
                Type: "S"
            }, 
            SortKey: {
                Name: "tone",
                Type: "S"
            }
        }
    })
    //console.log('Init: '+init)
    expect(init).toBe(`Table "${table}" created successfully`)
})

test("Put single item", async() => {
    const put = await db.put(items[0])
    //console.log('Put: '+JSON.stringify(put))
    expect(put).toBe(items[0])
})

test("Get single item", async() => {
    const { name, tone } = items[0]
    const get = await db.get({ name, tone })
    //console.log('Get: '+JSON.stringify(get))
    expect(get).toStrictEqual(items[0])
})

test("Update item", async() => {
    const { name, tone } = items[0]
    const update = await db.update({
        Key: { name, tone },
        Update: { of: ["ocean"] }
    })
    //console.log('Update: '+JSON.stringify(update))
    expect(update.of).toStrictEqual(["ocean"])
})

test("Delete single item", async() => {
    const deleted = await db.delete({ name: "blue", tone: "dark" })
    //console.log('Delete: '+JSON.stringify(deleted))
    expect(deleted.of).toStrictEqual(["ocean"])
})

test("Put multiple items", async() => {
    const put = await db.put(items)
    //console.log('Multi Put: '+JSON.stringify(put, null, 4))
    expect(put).toStrictEqual(items)
})

test("Get multiple items", async() => {
    const get = await db.get([
        {
            name: "blue",
            tone: "dark"
        },
        {
            name: "yellow",
            tone: "light"
        }
    ])
    //console.log('Multi Get: '+JSON.stringify(get, null, 4))
    expect(get.length).toStrictEqual(2)
})

test("Delete multiple items", async() => {
    const del = await db.delete([
        {
            name: "blue",
            tone: "dark"
        },
        {
            name: "yellow",
            tone: "light"
        }
    ])
    //console.log('Multi Delete: '+JSON.stringify(del, null, 4))
    expect(del.length).toStrictEqual(2)
})

test("Get all items", async() => {
    await db.put(items)
    const all = await db.all()
    //console.log('All: '+JSON.stringify(all, null, 4))
    expect(all).toStrictEqual(items)
})

test("Drop table", async() => {
    const drop = await db.drop()
    //console.log(drop)
    expect(drop).toBe(`Table "${table}" deleted.`)
})