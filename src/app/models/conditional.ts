import { Rule } from "./rule";
import { User } from "./user";

export interface Conditional {
    id: number,
    field: string,
    operator: string,
    value: string,
    rule: Rule,
    user: User,
    createdAt?: string,
    updatedAt?: string,
}