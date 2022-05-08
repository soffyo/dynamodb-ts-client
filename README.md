# DynamoDB TS Client
AWS DynamoDB Client with Typescript support. It is intended for use in Typescript environments where your schemas are already defined via classes or types like [TypeGraphQL](https://typegraphql.com/). You can pass them to the client and have them propagated to all its methods.

# Developemnt
This client covers the most basic DynamoDB usage. Some of the functionalities (like secondary indexes) are yet to be implemented. Check this page anytime soon to see evolutions!

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
        region: "eu-central-1" // You can omit this if you set the AWS_REGION .env variable. Example: AWS_REGION=eu-central-1
        ...
    } 
})

// Creates the table
await db.initialize({
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

// Retrieves all the items from the table (even if the output is larger than DynamoDB's 1MB limit)
await db.all()

// Creates the item(s) with given properties
await db.put({ name: "John", id: 1234, other: "..." })
await db.put([
    { name: "John", id: 1234, other: "..." }, 
    { name: "Robert", id: 5678, other: "..." }
])

// Retrieves the item(s) matching the Key(s) passed
await db.get({ name: "John", id: 1234 })
await db.get([{ name: "John", id: 1234 }, { name: "Robert", id: 5678 }])

// Updates the item (if existent) with the new props passed
await db.update({ 
    Key: { name: "John", id: 1234 }, 
    Update: { other: "..." } 
})

// Deletes the item(s) matching the Key(s)
await db.delete({ name: "John", id: 1234 })
await db.delete([{ name: "John", id: 1234 }, { name: "Robert", id: 5678 }])

// Completely removes the table with its content from the database
await db.drop()
```

# Usage example
In this example we create a simple GraphQL class resolver. This is a typical TypeGraphQL format (decorators have been omitted for improved readability).  
```ts
import { DynamoDB } from "dynamodb-ts-client"

class User {
    id: number
    name: string
    active: boolean
}

class UserInput implements User {
    id: number
    name: string
}

class UsersResolvers {
    private readonly db = new DynamoDB<User>({ TableName: "Users" })
    
    async users(): User[] {
        return await this.db.all()
    }

    async user(input: UserInput): User {
        return await this.db.get({ name: input.name, id: input.id }) // <- Type checking based on "User" 
    }

    async signup(user: UserInput): User {
        return await this.db.put({ active: false, ...user }) // <- Type checking based on "User"
    }

    async activate(input: UserInput): User {
        return await this.db.update({
            Key: {
                name: input.name,
                id: input.id
            },
            Update: {
                active: true
            }
        }) // <- Type checking based on "User"
    }
}
```