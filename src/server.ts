import express, { Application } from 'express';
import authRoutes from './routes/auth';

// Инициализация приложения
const app: Application = express();
app.use(express.json());

// Подключаем маршруты
app.use('/api/auth', authRoutes);

// Запуск сервера
const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
