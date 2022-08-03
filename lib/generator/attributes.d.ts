import { ConditionsObject } from "../types";
export declare function attributeValues(obj: Record<string, any>): Record<string, Exclude<any, {}>>;
export declare function attributeNames<T = any>(input: Array<keyof T>): Record<string, any>;
export declare function conditionAttributeValues<T>(obj: ConditionsObject<T>, marker?: string): Record<string, Exclude<any, {}>>;
