export class NegativeValueError extends Error {
  constructor() {
    super('Invalid value, should be greater or equals 0.');
  }
}
