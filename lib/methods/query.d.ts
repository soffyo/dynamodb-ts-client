import { Query, QueryInput, TSClientMethodConfig } from "../types";
export declare function query<T>({ table, client }: TSClientMethodConfig, input: QueryInput<T> | Query<T>): Promise<T[]>;
