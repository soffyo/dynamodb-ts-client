import { DynamoDB } from "../src"
import { remove } from "../src/operators"

declare class Obj {
    name: string
    id?: number
    content?: string
    list?: number[]
    map?: {
        a: number
        b: {
            c?: string
            d?: string
        }
    }
}

const item: Obj = {
    name: "Test item",
    id: 5,
    content: "This is the item for testing updates",
    list: [1, 2, 3],
    map: {
        a: 0,
        b: {
            c: "Nested value already present"
        }
    }
}
const db = new DynamoDB<Obj>({
    TableName: "update",
    Config: {
        region: "eu-central-1",
        endpoint: "http://localhost:8000",
        credentials: {
            secretAccessKey: "SAK",
            accessKeyId: "AKI"
        }
    }
})
test("update", async() => {
    await db.create({
        Keys: {
            PartitionKey: {
                Name: "name",
                Type: "S"
            }
        }
    })
    const put = await db.put(item)
    console.log(put)
    const updated = await db.update({
        key: { name: item.name },
        update: {
            id: 3,
            content: "The content for the item has been updated",
            list: [3],
            not_here: remove(),
            map: {
                b: {
                    c: "Nested value already present updated.",
                    d: "Nested value not present added.",
                    not_here: remove()
                }
            }
        },
        condition: {
            content: { contains: "This" },
            id: { equal: 5 },
            map: {
                a: { equal: 0 },
                b: {
                    c: { 
                        contains: "already"
                    },
                }
            }
        }
    })
    console.log(updated)
})
