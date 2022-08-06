import { ScalarAttributeType, DynamoDBClientConfig, BillingMode, DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"

export type QueryOperator = "EQUAL" | "LESSER" | "LESSER_EQUAL" | "GREATER" | "GREATER_EQUAL" | "BETWEEN" | "BEGINS_WITH"  
export type UpdateOperator =  "ADD" | "DELETE"
export type ConditionalOperator = QueryOperator | "ATTRIBUTE_EXISTS" | "ATTRIBUTE_TYPE" | "CONTAINS" | "SIZE" | "IN" 
export type Remove = "__removeDynamoDBAttribute"

export type Attributes<T> = {
    [K in keyof T]?: T[K]
}

type ValueOf<T> = T[keyof T]

type PickOnly<T,K extends keyof T> = Pick<T,K> & {[P in Exclude<keyof T,K>]?: never}

type RecursivePartial<T> = /* {
    [K in Exclude<any,keyof T>]?: Remove
} |  */T extends Set<any> ? T | {[K in keyof T]: never } : {
    [K in keyof T]?: RecursivePartial<T[K]> 
} 

export type CheckReservedKeys<T> = {
    [K in keyof T]: CheckReservedKeys<T[K]> 
} & {
    [K in (ConditionalOperator)]?: never
}

type Add<T> = {
    ADD: T extends Set<infer i> ? Set<i> : 
         T extends number ? number : 
         never
}

type Delete<T> = {
    DELETE: T extends Set<infer i> ? Set<i> : never
}

export type UpdateInput<T> = {
    update: {
        [K in keyof T]?: Add<T[K]> | Delete<T[K]> | RecursivePartial<T[K]>
    } /* | { 
        [K in Exclude<any,keyof T>]?: Remove
    } */
}

export type Keys<T> = ValueOf<{
    [K in keyof T]-?: Required<PickOnly<T,K>> | 
        ValueOf<{
            [L in Exclude<keyof T,K>]-?: PickOnly<T,K|L> 
        }>
}>

export type Query<T> = ValueOf<{
    [K in keyof T]-?: PickOnly<T,K> | 
        ValueOf<{
            [L in Exclude<keyof T,K>]-?: Record<K,T[K]> & 
                Record<L,ValueOf<QueryConditionsObject<Omit<T,K>>>> & 
                    {[P in Exclude<keyof T,K|L>]?: never }
        }>
}>

type Size = ValueOf<{
    [K in QueryOperator]?: {
        [x in K]-?: number
    } & { [L in Exclude<QueryOperator,K>]?: never }
}>

type ComparisonType<T,K> = 
    T extends "BETWEEN" ? [K,K] : 
    T extends "IN" ? K[] :
    T extends "BEGINS_WITH" ? K extends string ? K : never :
    T extends "CONTAINS" ? K extends (Array<infer i>|Set<infer i>) ? i : K extends string ? K : never : 
    T extends "ATTRIBUTE_TYPE" ? "N"|"S" : 
    T extends "SIZE" ? Size :
    T extends "ATTRIBUTE_EXISTS" ? boolean :
    K

type Condition<T> = {
    [K in ConditionalOperator]?: ComparisonType<K,T>
}

export type ConditionsObject<T> = {
    [K in keyof T]?: 
        T[K] extends (any[]|undefined) ? Condition<T[K]> : 
        T[K] extends (Set<any>|undefined) ? Condition<T[K]> :
        T[K] extends ({[k:string]:any}|undefined) ? ConditionsObject<T[K]> : 
        Condition<T[K]>
}

type QueryConditionsObject<T> = {
    [K in keyof T]?: {
        [J in QueryOperator]?: ComparisonType<J,T[K]>
    }
}

export interface KeySchema<T> {
    PartitionKey: {
        Name: keyof T extends string ? keyof T : string
        Type: ScalarAttributeType
    },
    SortKey?: {
        Name: keyof T extends string ? keyof T : string
        Type: ScalarAttributeType
    }
}

export interface TSClientParams {
    TableName: string
    Config?: DynamoDBClientConfig
}

export interface PrimaryKeys {
    PKName: string | number
    SKName?: string | number
}

export interface InitConfig<T> {
    Keys: KeySchema<T>
    BillingMode?: BillingMode
}

export interface TSClientMethodConfig {
    table: string, 
    client: DynamoDBDocumentClient
}

export interface TSClientConfig {
    table: string
    dynamodb: DynamoDBClient
    client: DynamoDBDocumentClient
    config: TSClientMethodConfig
}

export interface QueryInput<T> {
    query: Query<T>
    limit?: number
    ascending?: boolean
}

export type CommandInput<T> = {
    key: Keys<T>
    condition?: ConditionsObject<T>
}


