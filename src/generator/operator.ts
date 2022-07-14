import { ComparisonOperator, ConditionalOperator } from "../types";

export function convertOperator(key: string): ComparisonOperator | ConditionalOperator {
    switch (key) {
        case "equal": return "="
        case "greater": return ">"
        case "greater_equal": return ">="
        case "lesser_equal": return "<="
        case "lesser": return "<"
        case "between": return "BETWEEN"
        default: return key as ComparisonOperator | ConditionalOperator
    }
}