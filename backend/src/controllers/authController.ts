import { Request, Response } from 'express';
import pool from '../db/dbConfig';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { getUserByLogin } from '../models/userModel';
dotenv.config();

export async function signIn(req: Request, res: Response): Promise<void> {
    if(!req.body) {
        res.status(400).json({ message: 'Request body is required' });
        return;
    }
    const { login, password } = req.body;

    if(!login || !password) {
        res.status(400).json({ message: 'Login and password are required' });
        return;
    }
    try {
        const user = await getUserByLogin(login);
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: 'Invalid login or password' });
            return;
        }
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string);
        res.status(200).json({ token });
    } catch (error: any) {
        res.status(error.statusCode || 500).json({ message: error.message || 'Internal Server Error' });
    }
}