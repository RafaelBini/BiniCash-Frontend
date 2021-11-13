import { Conditional } from './conditional';
import { User } from "./user";

export interface Rule {
    id: number,
    field: string,
    value: string,
    orderNumber: number,
    Conditionals: Array<Conditional>,
    user: User,
    createdAt?: string,
    updatedAt?: string,
}