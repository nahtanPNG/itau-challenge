import dayjs from 'dayjs';
import { InvalidFieldsValuesError } from '../errors/invalid-fields-values.error';
import { TransactionService } from '../services/transaction.service';
import { Transaction, TransactionRequest, TransactionResponse } from '../types';
import { FutureTransactionError } from '../errors/future-transaction-error';
import { NegativeValueError } from '../errors/negative-value-error';

export class CreateTransactionUsecase {
  constructor(private transactionService: TransactionService) {}
  async create({
    value,
    dateHour,
  }: TransactionRequest): Promise<TransactionResponse> {
    if (!value || !dateHour) {
      throw new InvalidFieldsValuesError();
    }

    if (value < 0) {
      throw new NegativeValueError();
    }

    const actualDate = dayjs(new Date());
    const transactionDate = dayjs(dateHour);

    if (transactionDate.isAfter(actualDate)) {
      throw new FutureTransactionError();
    }

    const transaction = await this.transactionService.create({
      value,
      dateHour,
    });

    return {
      transaction,
    };
  }
}
