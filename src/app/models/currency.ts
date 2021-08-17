import { User } from "./user";

export interface Currency {
    id: number,
    name: string,
    description: string,
    symbol: string,
    user: User,
    createdAt?: string,
    updatedAt?: string,
}