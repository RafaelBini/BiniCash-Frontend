import { User } from "./user";

export interface Rule {
    id: number,
    field: string,
    value: string,
    orderNumber: string,
    user: User,
    createdAt?: string,
    updatedAt?: string,
}