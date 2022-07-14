import { DynamoDB } from "../src"

declare class Obj {
    name: string
    id?: number
    description?: string
}
const items: Array<Obj> = new Array(10).fill(0).map((item, index) => ({
    name: `item ${index}`,
    id: index,
    description: `this is the item ${index} description.`
}))
const table = "basic_test"
const db = new DynamoDB<Obj>({
    TableName: table,
    Config: {
        region: "eu-central-1",
        endpoint: "http://localhost:8000",
        credentials: {
            secretAccessKey: "SAK",
            accessKeyId: "AKI"
        }
    }
})
test('create', async () => {
    const create = await db.create({
        Keys: {
            PartitionKey: {
                Name: "name",
                Type: "S"
            }
        }
    })
    expect(create).toBe("Table \"basic_test\" created successfully")
})
test('put', async () => {
    const put = await db.put(items)
    expect(put).toStrictEqual(items)
})
test('get', async () => {
    const get = await db.get({ name: items[0].name })
    expect(get).toStrictEqual(items[0])
})
test('get Multi', async () => {
    const getMulti = await db.get([
        { name: items[2].name },
        { name: items[4].name }
    ])
    expect(getMulti[0]).toStrictEqual(items[2])
    expect(getMulti[1]).toStrictEqual(items[4])
})
test('scan', async () => {
    const scan = await db.scan()
    expect(scan.length).toBe(items.length)
})
test('delete', async () => {
    const delete_ = await db.delete({ name: items[0].name })
    expect(delete_).toStrictEqual(items[0])
})
test('update', async () => {
    const update = await db.update({ 
        key: { name: items[1].name },
        update: { id: 999 }
    })
    expect(update.id).toBe(999)
})