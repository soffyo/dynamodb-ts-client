# DynamoDB TS Client
AWS DynamoDB Client with Typescript support. It is intended for use in Typescript environments where your schemas are already defined via classes or types like [TypeGraphQL](https://typegraphql.com/). You can pass them to the class constructor and have them propagated to all its methods.

# Developemnt
This client is in early development stage and may lack essential features, or may appear unfinished. At this stage, it is not suitable for production environments yet. Expect to see more in the next future.

# Installation
```
npm i --save dynamodb-ts-client
```

# API
The idea is to pass the data schema via typescript generic arguments. Data schema can be passed to the constructor and it will propagate to all its methods.
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

// Retrieves the item(s) matching the Key(s) passed
await db.get("key")
await db.get(["key", "another key"])

// Creates the item(s) with given properties
await db.put({ ...item })
await db.put([{ ...item }, { ...anotherItem }])

// Updates the item (if existent) with the new props passed
await db.update("key", { ...newProps })

// Deletes the item(s) matching the Key(s)
await db.delete("key")
await db.delete(["key", "another key"])

// Removes every element from the table (but not the table itself)
await db.purge()

// Completely removes the table with its content from the database
await db.drop()
```

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

    async user(id: string): User {
        return await this.db.get(id)
    }

    async signup(props: UserInput): User {
        return await this.db.put({ active: false, ...props })
    }

    async activate(id: string): User {
        return await this.db.update(id, { active: true })
    }
}
```