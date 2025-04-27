export interface LoginInfo {
    username: string,
    password: string
}
export interface JWTPayload {
    account_id: string;
    username: string;
}