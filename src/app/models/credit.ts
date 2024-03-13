import { Source } from "./source";
import { User } from "./user";

export interface Credit {
    id: number,
    description: string,
    value: number,
    sourceDescription: string,
    Source: Source,
    creditDate: string,
    User: User,
    isTransference: Boolean,
    createdAt?: string,
    updatedAt?: string,
}