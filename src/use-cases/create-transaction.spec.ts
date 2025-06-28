import { expect, describe, it, beforeEach } from 'vitest';
import { CreateTransactionUsecase } from './create-transaction';
import { TransactionService } from '../services/transaction.service';
import { randomUUID } from 'node:crypto';

let transactionService: TransactionService;
let sut: CreateTransactionUsecase;

describe('Create transaction use case', () => {
  beforeEach(() => {
    transactionService = new TransactionService();
    sut = new CreateTransactionUsecase(transactionService);
  });
  it('should be able to create a transaction', async () => {
    const { transaction } = await sut.create({
      value: 100.0,
      dateHour: new Date(),
    });

    expect(transaction.id).toEqual(expect.any(String));
  });
});
