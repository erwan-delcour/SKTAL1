import pool from '../db/dbConfig';
import { validate as isUuid } from 'uuid';
import { CustomError } from '../utils/customError';

export interface UserModel {
    id: string;
    login: string;
    password: string;
    email: string;
    role: string;
}

export async function getUserByLogin(login: string): Promise<UserModel> {
    const query = 'SELECT * FROM users WHERE login = $1';
    const result = await pool.query(query, [login]);
    if (result.rows.length === 0) {
        throw new CustomError('User not found', 404);
    }
    const user = result.rows[0];
    delete user.password;
    return user as UserModel;
}