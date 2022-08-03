import { Keys, TSClientMethodConfig } from "../types";
export declare function get<T>({ table, client }: TSClientMethodConfig, input: Keys<T>[] | Keys<T>): Promise<T[] | T>;
