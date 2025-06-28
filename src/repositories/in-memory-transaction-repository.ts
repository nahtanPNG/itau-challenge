import { Transaction, TransactionRequest } from '../types';

export interface TransactionRepository {
  create(data: TransactionRequest): Promise<Transaction>;
}
