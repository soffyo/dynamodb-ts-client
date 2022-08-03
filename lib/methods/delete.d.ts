import { Keys, CommandInput, TSClientMethodConfig } from "../types";
export declare function _delete<T>({ table, client }: TSClientMethodConfig, input: Keys<T>[] | Keys<T> | CommandInput<T>): Promise<T[] | T>;
