import { DynamoDB } from "../src"

class Obj {
    name: "slug"
    id: number
    content?: string
}

const items: Array<Obj> = new Array(100).fill(0).map((item,i) => ({
    name: "slug",
    id: i,
    content: `this is the content n. ${i}`
}))
const table = "query_test"
const db: DynamoDB<Obj> = new DynamoDB<Obj>({ TableName: table, Config: {
    region: "eu-central-1",
    endpoint: "http://localhost:8000",
    credentials: {
        secretAccessKey: "dsf",
        accessKeyId: "ds"
    }
}})

test("query", async() => {
    await db.create({
        Keys: {
            PartitionKey: {
                Name: "name",
                Type: "S"
            },
            SortKey: {
                Name: "id",
                Type: "N"
            }
        }
    }) 
    await db.put(items)
    const query = await db.query({ 
        query: { 
            name: "slug", 
            id: { BETWEEN: [3,4] },
        }, 
        ascending: false 
    })
    await db.drop()
    console.log(query)
})

