import { TSClientMethodConfig } from "../types";
export declare function put<T>({ table, client }: TSClientMethodConfig, input: T[] | T): Promise<T[] | T>;
