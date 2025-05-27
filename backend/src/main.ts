import express from 'express';
import dotenv from 'dotenv';
import * as authRoutes from './routes/authRoutes';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/api/auth', authRoutes.default);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});