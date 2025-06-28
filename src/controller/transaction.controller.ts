import { Request, Response } from 'express';
import { z } from 'zod';
import { TransactionService } from '../services/transaction.service';
import { CreateTransactionUsecase } from '../use-cases/create-transaction';
import { DeleteTransactionUsecase } from '../use-cases/delete-transactions';
import { StatisticsUsecase } from '../use-cases/get-statistic';
import { FutureTransactionError } from '../errors/future-transaction-error';
import { InvalidFieldsValuesError } from '../errors/invalid-fields-values.error';
import { NegativeValueError } from '../errors/negative-value-error';

export class TransactionController {
  private readonly createTransactionUseCase: CreateTransactionUsecase;
  private readonly deleteTransactionUseCase: DeleteTransactionUsecase;
  private readonly statisticsUseCase: StatisticsUsecase;
  private readonly transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService();
    this.createTransactionUseCase = new CreateTransactionUsecase(
      this.transactionService,
    );
    this.deleteTransactionUseCase = new DeleteTransactionUsecase(
      this.transactionService,
    );
    this.statisticsUseCase = new StatisticsUsecase(this.transactionService);
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
      await this.deleteTransactionUseCase.deleteAll();
      response.status(200).send();
    } catch (error) {
      console.error('Unexpected error:', error);
      response.status(500).json({ error: 'Internal server error' });
    }
  }

  async getStatistics(request: Request, response: Response): Promise<void> {
    try {
      const statistics = await this.statisticsUseCase.getStatistics();
      response.status(200).json(statistics);
    } catch (error) {
      console.error('Unexpected error:', error);
      response.status(500).json({ error: 'Internal server error' });
    }
  }
}
