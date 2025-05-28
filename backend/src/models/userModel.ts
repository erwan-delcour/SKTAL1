import pool from '../db/dbConfig';
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
    return user as UserModel;
}


export async function getAllUsers(): Promise<UserModel[]> {
    const query = 'SELECT * FROM users';
    const result = await pool.query(query);
    return result.rows as UserModel[];
}

export async function getUserById(id: string): Promise<UserModel> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
        throw new CustomError('User not found', 404);
    }
    return result.rows[0] as UserModel;
}

