import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest';
import { CreateTransactionUsecase } from './create-transaction';
import { TransactionService } from '../services/transaction.service';
import { randomUUID } from 'node:crypto';
import { InvalidFieldsValuesError } from '../errors/invalid-fields-values.error';
import { FutureTransactionError } from '../errors/future-transaction-error';
import { NegativeValueError } from '../errors/negative-value-error';

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

  it('should be not able to create a transaction without value', async () => {
    await expect(() =>
      sut.create({
        value: null,
        dateHour: new Date(),
      }),
    ).rejects.toBeInstanceOf(InvalidFieldsValuesError);
  });

  it('should be not able to create a transaction without dateHour', async () => {
    await expect(() =>
      sut.create({
        value: 100.0,
        dateHour: null,
      }),
    ).rejects.toBeInstanceOf(InvalidFieldsValuesError);
  });

  it('should be not able to create a transaction in the future', async () => {
    await expect(() =>
      sut.create({
        value: 100.0,
        dateHour: new Date(2027, 4, 13, 8, 0, 0),
      }),
    ).rejects.toBeInstanceOf(FutureTransactionError);
  });

  it('should be not able to create a transaction with value less than 0', async () => {
    await expect(() =>
      sut.create({
        value: -1,
        dateHour: new Date(),
      }),
    ).rejects.toBeInstanceOf(NegativeValueError);
  });
});
