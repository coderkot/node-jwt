import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

// Регистрация пользователя
// @ts-ignore
router.post('/register', async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    try {
        // Проверка существующего пользователя
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Хэширование пароля
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Создание нового пользователя
        const newUser = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
            [username, email, hashedPassword]
        );

        res.status(201).json({ message: 'User created successfully', user: newUser.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Авторизация пользователя
// @ts-ignore
router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // Поиск пользователя по email
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Проверка пароля
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Создание JWT токена
        const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
