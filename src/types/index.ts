import { ScalarAttributeType, DynamoDBClientConfig, BillingMode, DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"
import { PickOnly, ValueOf, RecursivePartial } from "./utility"

export type ComparisonOperator = "=" | "<" | "<=" | ">" | ">=" | "BETWEEN" | "begins_with"

export type ConditionalOperator = ComparisonOperator | "attribute_exists" | "attribute_not_exists" | "attribute_type" | "contains" | "size"

export type StringOperator = "equal" | "greater" | "lesser" | "greater_equal" | "lesser_equal" | "between" 

export type Attributes<T> = {
    [K in keyof T]?: T[K]
}

export type Remove = "__removeDynamoDBAttribute"

export type UpdateInput<T> = {
    update: ValueOf<{
        [K in keyof T]?: {
            [k in K]?: RecursivePartial<T[K]>
        } | {
            [x in Exclude<any,K>]?: Remove
        }
    }>
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
    [K in ComparisonOperator]?: {
        [x in K]-?: number
    } & { [L in Exclude<ComparisonOperator,K>]?: never }
}>

type ComparisonType<T,K> = 
    T extends "BETWEEN"|"between" ? [K,K] : 
    T extends "begins_with" ? K extends string ? K : never :
    T extends "contains" ? K extends (infer G)[] ? G : K extends string ? K : never : 
    T extends "attribute_type" ? "N"|"S" : 
    T extends "size" ? Size :
    T extends "attribute_exists" ? boolean :
    K

export type ConditionsObject<T> = {
    [K in keyof T]?: T[K] extends (Exclude<{[k:string]: any}|undefined,any[]>) ? ConditionsObject<T[K]> : {
        [J in ConditionalOperator|StringOperator]?: ComparisonType<J,T[K]>
    }
}

type QueryConditionsObject<T> = {
    [K in keyof T]?: {
        [J in ComparisonOperator|StringOperator]?: ComparisonType<J,T[K]>
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


