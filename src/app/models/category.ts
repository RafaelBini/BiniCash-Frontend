import { Currency } from './currency';
import { User } from "./user";

export interface Category {
    id: number,
    name: string,
    description: string,
    isDebitRequired: boolean,
    isShortSaving: boolean,
    isLongSaving: boolean,
    isTransference: boolean,
    priority: number,
    active: boolean,
    Currency: Currency,
    User: User,
    createdAt?: string,
    updatedAt?: string,
}