import { Rule } from "./rule";
import { User } from "./user";

export interface Condtional {
    id: number,
    field: string,
    operator: string,
    value: string,
    rule: Rule,
    user: User,
    createdAt?: string,
    updatedAt?: string,
}