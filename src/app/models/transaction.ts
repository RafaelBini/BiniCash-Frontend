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
    transactionDate: string,
    Category: Category,
    Source: Source,
    parentTransaction: Transaction,
    User: User,
    createdAt?: string,
    updatedAt?: string,
}