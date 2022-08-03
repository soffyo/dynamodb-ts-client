import { TSClientMethodConfig } from "../types";
export declare function scan<T>({ table, client }: TSClientMethodConfig, limit?: number): Promise<T[]>;
