import { Pool } from 'pg';
import dotenv from 'dotenv';

// Загружаем переменные окружения из .env файла
dotenv.config();

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: Number(process.env.PGPORT),
});

export default pool;