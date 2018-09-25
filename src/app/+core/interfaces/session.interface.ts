import { IUser } from "./user.interface";

export interface ISession {
    expiresOn?: number;
    user?: IUser;
    [key: string]: any;
}