declare type AttributeValue = `:_${string}_`;
declare type AttributeName = `#_${string}_`;
declare type AttributeValues = Record<AttributeValue, any>;
declare type AttributeNames = Record<AttributeName, string>;
export declare class DynamoDBGenerator<PropsType = Record<string, Exclude<any, object>>> {
    private readonly props;
    constructor(props: PropsType);
    AttributeValues(): AttributeValues;
    AttributeNames(): AttributeNames;
    UpdateExpression(): string;
}
export {};
