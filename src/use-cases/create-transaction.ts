import { TransactionService } from '../services/transaction.service';
import { Transaction, TransactionRequest, TransactionResponse } from '../types';

export class CreateTransactionUsecase {
  constructor(private transactionService: TransactionService) {}
  async create({
    value,
    dateHour,
  }: TransactionRequest): Promise<TransactionResponse> {
    const transaction = await this.transactionService.create({
      value,
      dateHour,
    });

    return {
      transaction,
    };
  }
}
