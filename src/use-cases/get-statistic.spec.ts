import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest';
import { StatisticsUsecase } from './get-statistic';
import { TransactionService } from '../services/transaction.service';
import { CreateTransactionUsecase } from './create-transaction';

let transactionService: TransactionService;
let statisticsUsecase: StatisticsUsecase;
let createTransactionUsecase: CreateTransactionUsecase;

describe('Statistics use case', () => {
  beforeEach(() => {
    transactionService = new TransactionService();
    statisticsUsecase = new StatisticsUsecase(transactionService);
    createTransactionUsecase = new CreateTransactionUsecase(transactionService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return zero statistics when there are no transactions', async () => {
    const statistics = await statisticsUsecase.getStatistics();

    expect(statistics).toEqual({
      count: 0,
      sum: 0,
      avg: 0,
      min: 0,
      max: 0,
    });
  });

  it('should return zero statistics when there are no recent transactions', async () => {
    const oldDate = new Date(Date.now() - 120 * 1000);

    await createTransactionUsecase.create({
      value: 100.0,
      dateHour: oldDate,
    });

    const statistics = await statisticsUsecase.getStatistics();

    expect(statistics).toEqual({
      count: 0,
      sum: 0,
      avg: 0,
      min: 0,
      max: 0,
    });
  });

  it('should calculate correct statistics for recent transactions', async () => {
    const now = new Date();

    await createTransactionUsecase.create({
      value: 10.0,
      dateHour: new Date(now.getTime() - 30 * 1000),
    });

    await createTransactionUsecase.create({
      value: 20.0,
      dateHour: new Date(now.getTime() - 10 * 1000),
    });

    await createTransactionUsecase.create({
      value: 30.0,
      dateHour: now,
    });

    const statistics = await statisticsUsecase.getStatistics();

    expect(statistics).toEqual({
      count: 3,
      sum: 60.0,
      avg: 20.0,
      min: 10.0,
      max: 30.0,
    });
  });

  it('should work with custom time window', async () => {
    const now = new Date();

    await createTransactionUsecase.create({
      value: 100.0,
      dateHour: new Date(now.getTime() - 90 * 1000),
    });

    const defaultStats = await statisticsUsecase.getStatistics();
    expect(defaultStats.count).toBe(0);

    const customStats = await statisticsUsecase.getStatistics(120);
    expect(customStats.count).toBe(1);
    expect(customStats.sum).toBe(100.0);
  });
});
