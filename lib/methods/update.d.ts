import { TSClientMethodConfig, CommandInput, UpdateInput } from "../types";
export declare function update<T>({ table, client }: TSClientMethodConfig, input: CommandInput<T> & UpdateInput<T>): Promise<T>;
