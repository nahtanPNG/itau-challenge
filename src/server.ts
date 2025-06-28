import express from 'express';
import { createTransaction } from './controller/transaction.controller';

const app = express();
const port = process.env.PORT || 3333;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running!');
});

app.post('/transaction', createTransaction);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
