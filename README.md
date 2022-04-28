# DynamoDB TS Client
AWS DynamoDB Client with Typescript support. It is intended for use in Typescript environments where your schemas are already defined via classes or types like [TypeGraphQL](https://typegraphql.com/). You can pass them to the class constructor and have them propagated to all its methods.

# Developemnt
This client is in early development stage and may lack essential features, or may appear unfinished. At this stage, it is not suitable for production environments yet. Expect to see more in the next future.

# Installation
```
npm i --save dynamodb-ts-client
```

# API
The idea is to pass the data schema via typescript generic arguments. Data schema can be passed to the constructor and it will propagate to all its methods but each method accepts its own generic arguments too, so you can decide which approach is better for you.
```ts
import { DynamoDB } from "dynamodb-ts-client"

// Initializes the client with the schema passed as <ItemType> which propagates to all the subsequent methods.
const db = new DynamoDB<ItemType>({ 
    TableName: "My Table", // Always needed.
    Config: {
        ...
        region: "eu-central-1" // Needed if AWS_REGION .env variable is not set.
        ...
    } 
})

// Creates the table
await db.initialize({
    PartitionKey: "partitionKey",
    SortKey: "sortKey"
})

// Retrieves all the items from the table
await db.all()

// Retrieves the item matching the Partition Key passed
await db.get("partitionKey")

// Creates the item with given properties
await db.put({ ...props })

// Updates the item (if existent) with the new props passed
await db.update("partitionKey", { ...newprops })

// Deletes the item matching the Partition Key passed
await db.delete("hashKey")

// Removes every element from the table (but not the table itself)
await db.purge()
```
Each method accepts its own generic argument so you can ovwerwrite what is passed to the constructor. For example:
```ts
await db.put<DifferentSchema>({ ...props }) 
```
Will be checked against `<DifferentSchema>`.

# Usage example
In this example we create a simple GraphQL class resolver. This is a typical TypeGraphQL format, with decorators omitted for improved readability.
```ts
import { DynamoDB } from "dynamodb-ts-client"

class User {
    id: string
    username: string
    active: boolean
}

class UserInput implements User {
    id: string
    username: string
}

class UsersResolvers {
    private readonly db = new DynamoDB<User>({ TableName: "Users" })
    
    async users(): User[] {
        return await this.db.all()
    }

    async user(id: User["id"]): User {
        return await this.db.get(id)
    }

    async signup(props: UserInput): User {
        return await this.db.put({ active: false, ...props })
    }

    async activate(id: User["id"]): User {
        return await this.db.update(id, { active: true })
    }
}
```