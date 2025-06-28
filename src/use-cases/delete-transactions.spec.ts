import { expect, describe, it, beforeEach } from 'vitest';
import { DeleteTransactionUsecase } from './delete-transactions';
import { TransactionService } from '../services/transaction.service';
import { CreateTransactionUsecase } from './create-transaction';

let transactionService: TransactionService;
let deleteTransactionUsecase: DeleteTransactionUsecase;
let createTransactionUsecase: CreateTransactionUsecase;

describe('Delete transaction use case', () => {
  beforeEach(() => {
    transactionService = new TransactionService();
    deleteTransactionUsecase = new DeleteTransactionUsecase(transactionService);
    createTransactionUsecase = new CreateTransactionUsecase(transactionService);
  });

  it('should be able to delete all transactions', async () => {
    await createTransactionUsecase.create({
      value: 100.0,
      dateHour: new Date(),
    });

    await createTransactionUsecase.create({
      value: 200.0,
      dateHour: new Date(),
    });

    expect(transactionService.transactions).toHaveLength(2);

    await deleteTransactionUsecase.deleteAll();

    expect(transactionService.transactions).toHaveLength(0);
  });
});
