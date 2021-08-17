import { Source } from "./source";
import { User } from "./user";

export interface Credit {
    id: number,
    description: string,
    value: number,
    sourceDescription: string,
    source: Source,
    credit_date: string,
    user: User,
    createdAt?: string,
    updatedAt?: string,
}