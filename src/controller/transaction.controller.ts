import { Request, Response } from 'express';
import { z } from 'zod';
import { TransactionService } from '../services/transaction.service';
import { CreateTransactionUsecase } from '../use-cases/create-transaction';
import { FutureTransactionError } from '../errors/future-transaction-error';
import { InvalidFieldsValuesError } from '../errors/invalid-fields-values.error';
import { NegativeValueError } from '../errors/negative-value-error';

export const createTransaction = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const registerBodySchema = z.object({
    value: z.number(),
    dateHour: z.coerce.date(),
  });

  try {
    const { value, dateHour } = registerBodySchema.parse(request.body);

    const transactionService = new TransactionService();
    const createTransactionUseCase = new CreateTransactionUsecase(
      transactionService,
    );

    await createTransactionUseCase.create({ value, dateHour });

    response.status(201).json();
  } catch (error) {
    if (
      error instanceof FutureTransactionError ||
      error instanceof InvalidFieldsValuesError ||
      error instanceof NegativeValueError
    ) {
      response.status(422).json();
      return;
    }

    if (error instanceof z.ZodError) {
      response.status(400).json();
      return;
    }

    console.error('Unexpected error:', error);
    response.status(500).json({ error: 'Internal server error' });
  }
};
