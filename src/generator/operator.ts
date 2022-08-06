import { QueryOperator, ConditionalOperator } from "../types";

export function convertOperator(key: string) {
    switch (key) {
        case "EQUAL": return "="
        case "GREATER": return ">"
        case "GREATER_EQUAL": return ">="
        case "LESSER_EQUAL": return "<="
        case "LESSER": return "<"
        default: return key as QueryOperator | ConditionalOperator
    }
}