import { Currency } from './currency';
import { User } from "./user";

export interface Source {
    id: number,
    secondId: string,
    name: string,
    type: string,
    imageUrl: string,
    currency: Currency,
    active: boolean,
    user: User,
    createdAt?: string,
    updatedAt?: string,
}