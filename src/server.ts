import express from 'express';
import { TransactionController } from './controller/transaction.controller';
import { TransactionService } from './services/transaction.service';
import { CreateTransactionUsecase } from './use-cases/create-transaction';
import { DeleteTransactionUsecase } from './use-cases/delete-transactions';
import { StatisticsUsecase } from './use-cases/get-statistic';

const app = express();
const port = process.env.PORT || 3333;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running!');
});

const transactionService = new TransactionService();
const createTransactionUsecase = new CreateTransactionUsecase(
  transactionService,
);
const deleteTransactionUsecase = new DeleteTransactionUsecase(
  transactionService,
);
const statisticsUsecase = new StatisticsUsecase(transactionService);

const transactionController = new TransactionController(
  createTransactionUsecase,
  deleteTransactionUsecase,
  statisticsUsecase,
);

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
