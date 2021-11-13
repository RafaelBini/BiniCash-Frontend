import { Source } from "./source";
import { User } from "./user";

export interface Credit {
    id: number,
    description: string,
    value: number,
    sourceDescription: string,
    Source: Source,
    credit_date: string,
    User: User,
    createdAt?: string,
    updatedAt?: string,
}