import { DynamoDB } from "../src"
import { remove } from "../src/operators"

declare class Obj {
    //EQUAL?: string
    pk: string
    sk: number
    list?: number[]
    stringSet?: Set<string>
    numberSet?: Set<number>
    map?: {
        a: number
        b: {
            c?: string
            d?: string
            e?: number
            f?: Set<number>
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
                Name: "pk",
                Type: "S"
            },
            SortKey: {
                Name: "sk",
                Type: "N"
            }
        }
    })
    const item: Obj = {
        pk: "pk",
        sk: 4,
        map: {
            a: 0,
            b: {
                c: "Nested value already present",
                e: 432,
                f: new Set([0,1,2])
            }
        },
        list: [1, 2, 3],
        stringSet: new Set(["a", "b", "c"]),
        numberSet: new Set([1,2,3,4])
    }
    const put = await db.put(item)
    console.log(put)
    const updated = await db.update({
        key: { pk: item.pk, sk: item.sk },
        update: {
            //sk: { ADD: 4 },
            list: [2, 3, 4],
            stringSet: { ADD: new Set(["c35f"]) },
            numberSet: { ADD: new Set([34])},
            map: {
                a: 1,
                b: {
                    c: "Nested value updated",
                    d: "Nested value not present added.",
                    e: 4,
                    f: new Set([9])
                }
            }
        },
        condition: {
            pk: { BEGINS_WITH: "p" },
            sk: { GREATER_EQUAL: 0 },
            list: { CONTAINS: 3 },
            stringSet: { CONTAINS: "a" },
            numberSet: { CONTAINS: 1 },
            map: {
                a: { BETWEEN: [0,2] },
                b: {
                    c: { CONTAINS: "Nested" },
                    //d: { SIZE: { GREATER_EQUAL: 0 }},
                    e: { IN: [0,432,5667] },
                    f: { CONTAINS: 1 }
                }
            }
        }
    })
    console.log(updated.sk)
    console.log(updated.stringSet)
    console.log(updated.numberSet)
})
