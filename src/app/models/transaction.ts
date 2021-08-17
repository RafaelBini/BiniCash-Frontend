import { Category } from './category';
import { Source } from "./source";
import { User } from "./user";

export interface Transaction {
    id: number,
    description: string,
    sourceDescription: string,
    sourceReference: string,
    inputMethod: string,
    value: number,
    transaction_date: string,
    category: Category,
    source: Source,
    parentTransaction: Transaction,
    user: User,
    createdAt?: string,
    updatedAt?: string,
}