import { Request, Response } from 'express';
import {getUserById, UserModel} from '../models/userModel';
import { getAllUsers } from '../models/userModel';

export async function getUsers(req: Request, res: Response): Promise<void> {
    try {
        const users: UserModel[] = await getAllUsers();
        res.status(200).json(users);
    } catch (error: any) {
        res.status(error.statusCode || 500).json({ message: error.message || 'Internal Server Error' });
    }
}

export async function getUser(req: Request, res: Response): Promise<void> {
    const userId = req.params.id;
    try {
        const user: UserModel = await getUserById(userId);
        res.status(200).json(user);
    } catch (error: any) {
        res.status(error.statusCode || 500).json({ message: error.message || 'Internal Server Error' });
    }
}


