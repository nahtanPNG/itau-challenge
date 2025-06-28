export interface TransactionRequest {
  value: number;
  dateHour: Date;
}

export interface Transaction {
  id: string;
  value: number;
  dateHour: Date;
}

export interface TransactionResponse {
  transaction: Transaction;
}
