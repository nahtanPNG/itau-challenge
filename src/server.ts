import express from 'express';
import { TransactionController } from './controller/transaction.controller';

const app = express();
const port = process.env.PORT || 3333;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running!');
});
const transactionController = new TransactionController();

app.post(
  '/transacao',
  transactionController.create.bind(transactionController),
);
app.delete(
  '/transacao',
  transactionController.delete.bind(transactionController),
);
app.get(
  '/estatistica',
  transactionController.getStatistics.bind(transactionController),
);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
