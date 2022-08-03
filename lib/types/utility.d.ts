import { Remove } from "../types";
export declare type ValueOf<T> = T[keyof T];
export declare type PickOnly<T, K extends keyof T> = Pick<T, K> & {
    [P in Exclude<keyof T, K>]?: never;
};
export declare type RecursivePartial<T> = {
    [K in Exclude<any, keyof T>]?: Remove;
} | {
    [K in keyof T]?: RecursivePartial<T[K]>;
};
