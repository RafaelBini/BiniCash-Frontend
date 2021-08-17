import { User } from "./user";

export interface Config {
    id: number,
    value: string,
    name: string,
    user: User,
    createdAt?: string,
    updatedAt?: string,
}