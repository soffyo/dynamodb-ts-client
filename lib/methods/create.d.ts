import { TSClientMethodConfig, InitConfig } from "../types";
export declare function create<T>({ table, client }: TSClientMethodConfig, { Keys, BillingMode }: InitConfig<T>): Promise<string>;
