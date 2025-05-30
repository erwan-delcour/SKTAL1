import express from 'express';
import dotenv from 'dotenv';
import * as authRoutes from './routes/authRoutes';
import * as reservationRoutes from './routes/reservationRoutes';
import * as statsRoutes from './routes/statsRoutes';
import morgan = require('morgan');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/api/auth', authRoutes.default);
app.use('/api/reservations', reservationRoutes.default);
app.use('/api/stats', statsRoutes.default);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});