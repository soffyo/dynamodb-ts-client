import { DynamoDB } from "../src"

declare class Obj {
    lesser: string
    nest: {
        "=": string
        greater: string
        sub: {
            equal: string
            "<=": string
        }
    }
}
const db = new DynamoDB<Obj>({
    TableName: "update",
    Config: {
        endpoint: "http://localhost:8000",
        credentials: {
            secretAccessKey: "SAK",
            accessKeyId: "AKI"
        }
    }
})
const item: Obj = {
    lesser: "reserved name",
    nest: {
        "=": "reserved name",
        greater: "reserved name",
        sub: {
            equal: "reserved name",
            "<=": "reserved name"
        }
    }
}
test('error', async () => {
    const create = await db.create({
        Keys: {
            PartitionKey: {
                Name: "lesser",
                Type: "S"
            }
        }
    })
    const put = await db.put(item)
    console.log(put)
})