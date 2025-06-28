import { TransactionService } from '../services/transaction.service';
import { env } from '../config/env';

export interface StatisticsResponse {
  count: number;
  sum: number;
  avg: number;
  min: number;
  max: number;
}

export class StatisticsUsecase {
  constructor(private transactionService: TransactionService) {}

  async getStatistics(
    timeWindowInSeconds?: number,
  ): Promise<StatisticsResponse> {
    const timeWindow =
      timeWindowInSeconds ?? env.STATISTICS_TIME_WINDOW_SECONDS;
    const now = new Date();
    const timeThreshold = new Date(now.getTime() - timeWindow * 1000);

    const recentTransactions = this.transactionService.transactions.filter(
      (transaction) =>
        transaction.dateHour &&
        transaction.value !== null &&
        transaction.dateHour >= timeThreshold &&
        transaction.dateHour <= now,
    );

    if (recentTransactions.length === 0) {
      return {
        count: 0,
        sum: 0,
        avg: 0,
        min: 0,
        max: 0,
      };
    }

    const values = recentTransactions
      .map((t) => t.value)
      .filter((value): value is number => value !== null);

    const count = values.length;
    const sum = values.reduce((acc, val) => acc + val, 0);
    const avg = count > 0 ? sum / count : 0;
    const min = count > 0 ? Math.min(...values) : 0;
    const max = count > 0 ? Math.max(...values) : 0;

    return {
      count,
      sum,
      avg,
      min,
      max,
    };
  }
}
