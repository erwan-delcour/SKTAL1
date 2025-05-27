import { Request, Response } from 'express';
import pool from '../db/dbConfig';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { getUserByLogin, UserModel } from '../models/userModel';
dotenv.config();

export const signUp = async (req: Request, res: Response): Promise<void> => {
    if(!req.body) {
        res.status(400).json({ message: 'Request body is required' });
        return;
    }
    const { email, login, password } = req.body;

    if (!email || !login || !password) {
        res.status(400).json({ message: 'Des champs obligatoires sont manquants' });
        return;
    }

    try {
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1 OR login = $2', [email, login]);
        if (userExists.rows.length > 0) {
            res.status(409).json({ message: 'L\'email ou le login est déjà utilisé.' });
            return;
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await pool.query(
            `INSERT INTO users (email, login, password)
             VALUES ($1, $2, $3)
             RETURNING id, email, login`,
            [email, login, hashedPassword]
        );
        res.status(201).json({message: 'Utilisateur créé avec succès'});
        return;
    } catch (error: any) {
        res.status(error.status || 500).json({ message: 'Erreur serveur' });
        return;
    }

}


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
        if (!user || !user.password) {
            res.status(401).json({ error: 'Invalid login or password' });
            return;
        }
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