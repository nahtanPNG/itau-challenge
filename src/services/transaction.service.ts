import { randomUUID } from 'node:crypto';
import { TransactionRepository } from '../repositories/in-memory-transaction-repository';
import { Transaction, TransactionRequest } from '../types';

export class TransactionService implements TransactionRepository {
  public transactions: Transaction[] = [];

  async create(data: TransactionRequest) {
    const transaction = {
      id: randomUUID(),
      value: data.value,
      dateHour: data.dateHour,
    };

    this.transactions.push(transaction);
    console.log(this.transactions);

    return transaction;
  }
}
