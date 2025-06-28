export interface TransactionRequest {
  value: number | null;
  dateHour: Date | null;
}

export interface Transaction {
  id: string;
  value: number | null;
  dateHour: Date | null;
}

export interface TransactionResponse {
  transaction: Transaction;
}
