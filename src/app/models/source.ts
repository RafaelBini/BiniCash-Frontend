import { Currency } from './currency';
import { User } from "./user";

export interface Source {
    id: number,
    secondId: string,
    name: string,
    type: string,
    imageUrl: string,
    Currency: Currency,
    active: boolean,
    User: User,
    createdAt?: string,
    updatedAt?: string,
}