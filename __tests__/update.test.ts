import { DynamoDB } from "../src"
import { remove } from "../src/operators"

declare class Obj {
    //equal?: string
    name: string
    id?: number
    content?: string
    list?: number[]
    set?: Set<string>
    set2?: Set<number>
    map?: {
        //equal?: number
        a: number
        //add?: { add: number }
        b: {
            c?: string
            d?: string
            e?: number
            f?: Set<number>
        }
    }
}

const item: Obj = {
    map: {
        a: 0,
        b: {
            c: "Nested value already present",
            d: "Optional member",
            e: 432,
            f: new Set([0,1,2])
        }
    },
    name: "Test item",
    id: 5,
    content: "This is the item for testing updates",
    list: [1, 2, 3],
    set: new Set(["a", "b", "c"]),
    set2: new Set([1,2,3,4])
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
            id: { ADD: 4 },
            //unexistent: remove(),
            content: "ds",
            list: [2, 3, 4],
            set: { ADD: new Set(["c35f"]) },
            set2: { ADD: new Set([34])},
            map: {
                b: {
                    //unexistent: remove(),
                    //c: remove(),
                    d: "Nested value not present added.",
                    e: 4,
                    f: new Set([7,8,9])
                }
            }
        },
        condition: {
            name: { BEGINS_WITH: "Test" },
            content: { CONTAINS: "This" },
            id: { LESSER_EQUAL: 5 },
            list: { CONTAINS: 3 },
            map: {
                a: { BETWEEN: [0,1] },
                b: {
                    c: { CONTAINS: "already" },
                    d: { SIZE: { GREATER: 1 }},
                    e: { IN: [0,432,5667] },
                    f: { CONTAINS: 1 }
                }
            },
            set: { CONTAINS: "a" }
        }
    })
    console.log(updated.set)
    console.log(updated.set2)
})
