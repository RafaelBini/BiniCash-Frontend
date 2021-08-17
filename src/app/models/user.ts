export interface User {
    id: number,
    username: string,
    name: string,
    password: string,
    email: string,
    routineStep: number,
    createdAt?: string,
    updatedAt?: string,
}