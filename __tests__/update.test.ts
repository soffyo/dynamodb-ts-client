import { DynamoDB } from "../src"
import { remove } from "../src/operators"

declare class Obj {
    //equal?: string
    name: string
    id?: number
    content?: string
    list?: number[]
    map?: {
        //equal?: number
        a: number
        b: {
            c?: string
            d?: string
        }
    }
}

const item: Obj = {
    map: {
        a: 0,
        b: {
            c: "Nested value already present"
        }
    },
    name: "Test item",
    id: 5,
    content: "This is the item for testing updates",
    list: [1, 2, 3],
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
            // id: remove(),
            unexistent: remove(),
            content: remove(),
            list: [3],
            map: {
                unexistent: remove(),
                b: {
                    unexistent: remove(),
                    c: remove(),
                    d: "Nested value not present added.",
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
