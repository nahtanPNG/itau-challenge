import { Request, Response } from 'express';
import { z } from 'zod';
import { TransactionService } from '../services/transaction.service';
import { CreateTransactionUsecase } from '../use-cases/create-transaction';
import { FutureTransactionError } from '../errors/future-transaction-error';
import { InvalidFieldsValuesError } from '../errors/invalid-fields-values.error';
import { NegativeValueError } from '../errors/negative-value-error';

export class TransactionController {
  private readonly createTransactionUseCase: CreateTransactionUsecase;
  private readonly transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService();
    this.createTransactionUseCase = new CreateTransactionUsecase(
      this.transactionService,
    );
  }

  async create(request: Request, response: Response): Promise<void> {
    const registerBodySchema = z.object({
      valor: z.number(),
      dataHora: z.coerce.date(),
    });

    try {
      const { valor, dataHora } = registerBodySchema.parse(request.body);

      await this.createTransactionUseCase.create({
        value: valor,
        dateHour: dataHora,
      });

      response.status(201).send();
    } catch (error) {
      console.log(error);
      if (
        error instanceof FutureTransactionError ||
        error instanceof InvalidFieldsValuesError ||
        error instanceof NegativeValueError
      ) {
        response.status(422).send();
        return;
      }

      if (error instanceof z.ZodError) {
        response.status(400).send();
        return;
      }

      console.error('Unexpected error:', error);
      response.status(500).json({ error: 'Internal server error' });
    }
  }

  async delete(request: Request, response: Response): Promise<void> {
    try {
      this.transactionService.transactions = [];
      response.status(200).send();
    } catch (error) {
      console.error('Unexpected error:', error);
      response.status(500).json({ error: 'Internal server error' });
    }
  }

  async getStatistics(request: Request, response: Response): Promise<void> {
    try {
      const now = new Date();
      const sixtySecondsAgo = new Date(now.getTime() - 60 * 1000);

      const recentTransactions = this.transactionService.transactions.filter(
        (transaction) =>
          transaction.dateHour &&
          transaction.dateHour >= sixtySecondsAgo &&
          transaction.dateHour <= now,
      );

      if (recentTransactions.length === 0) {
        response.status(200).json({
          count: 0,
          sum: 0,
          avg: 0,
          min: 0,
          max: 0,
        });
        return;
      }

      const values = recentTransactions
        .map((t) => t.value)
        .filter((value): value is number => value !== null);

      const count = values.length;
      const sum = values.reduce((acc, val) => acc + val, 0);
      const avg = count > 0 ? sum / count : 0;
      const min = count > 0 ? Math.min(...values) : 0;
      const max = count > 0 ? Math.max(...values) : 0;

      response.status(200).json({
        count,
        sum,
        avg,
        min,
        max,
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      response.status(500).json({ error: 'Internal server error' });
    }
  }
}
