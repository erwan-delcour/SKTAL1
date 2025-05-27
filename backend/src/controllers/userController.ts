import { Request, Response } from 'express';
import { UserModel } from '../models/userModel';
import { getAllUsers } from '../models/userModel';

export async function getUsers(req: Request, res: Response): Promise<void> {
    try {
        const users: UserModel[] = await getAllUsers();
        res.status(200).json(users);
    } catch (error: any) {
        res.status(error.statusCode || 500).json({ message: error.message || 'Internal Server Error' });
    }
}
