import { DynamoDB } from "../src"

class TestItem {
    partitionTest: string
    sortTest?: string
    optionalProp?: string
}

const table = "test_table"
const db = new DynamoDB<TestItem>({ 
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

const item: TestItem = {
    partitionTest: "Hash 0",
    sortTest: "Range 0",
    optionalProp: "Optional 0"
}

const items: TestItem[] = [
    {
        partitionTest: "Hash 1",
        sortTest: "Range 1",
        optionalProp: "Optional 1"
    },
    {
        partitionTest: "Hash 2",
        sortTest: "Range 2",
        optionalProp: "Optional 2"
    }
]

test("Initialize table", async() => {
    const init = await db.initialize({
        PartitionKey: "partitionTest"
    })

    expect(init).toBe(`Table "${table}" created succsessfully`)
})

test("Put single item", async() => {
    const put = await db.put(item)

    expect(put).toBe(item)
})

test("Get single item", async() => {
    const get = await db.get(item.partitionTest)

    expect(get).toStrictEqual(item)
})

test("Update item", async() => {
    const update = await db.update(item.partitionTest, { optionalProp: "Updated optional 0" })

    expect(update.optionalProp).toBe("Updated optional 0")
})

test("Delete single item", async() => {
    const del = await db.delete(item.partitionTest)

    expect(del.optionalProp).toBe("Updated optional 0")
})

test("Put multiple items", async() => {
    const put = await db.put(items)

    expect(put.length).toBe(items.length)
})

test("Get multiple items", async() => {
    const get = await db.get([items[1].partitionTest, items[0].partitionTest])

    expect(get.length).toBe(items.length)
})

test("Delete multiple items", async() => {
    const del = await db.delete([items[0].partitionTest, items[1].partitionTest])

    expect(del.length).toBe(items.length)
})

test("Get all items", async() => {
    await db.put(items)
    const all = await db.all()

    expect(all.length).toBe(items.length)
})

test("Remove all items from table", async() => {
    const purge = await db.purge()

    expect(purge).toBe(`Every element (${items.length.toString()}) on Table: "${table}" has been deleted successfully.`)
})

test("Drop table", async() => {
    const drop = await db.drop()

    expect(drop).toBe(`Table "${table}" deleted.`)
})