export interface User {
    name: string,
    email: string,
    password: string,
    avatar_url: string
}

export interface Login {
    email: string,
    password: string,
}