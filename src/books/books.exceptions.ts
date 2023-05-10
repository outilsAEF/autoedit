export class InvalidASINException extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidASINException';
  }
}
