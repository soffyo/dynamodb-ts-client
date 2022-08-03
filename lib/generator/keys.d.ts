import { TSClientMethodConfig, PrimaryKeys } from "../types";
export declare function keys({ table, client }: TSClientMethodConfig): Promise<PrimaryKeys>;
export declare function key({ PKName, SKName }: {
    PKName: any;
    SKName: any;
}, input: any): {
    [x: number]: any;
};
