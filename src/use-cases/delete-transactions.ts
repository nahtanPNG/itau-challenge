import { TransactionService } from '../services/transaction.service';

export class DeleteTransactionUsecase {
  constructor(private transactionService: TransactionService) {}

  async deleteAll(): Promise<void> {
    this.transactionService.transactions = [];
  }
}
