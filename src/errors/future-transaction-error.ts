export class FutureTransactionError extends Error {
  constructor() {
    super('The transaction cannot be in the future');
  }
}
