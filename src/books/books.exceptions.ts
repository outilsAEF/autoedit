export class InvalidASINException extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidASINException';
  }
}

// HINT
// The global exception filter partially supports the http-errors library. Basically, any thrown exception containing the statusCode and message properties will be properly populated and sent back as a response (instead of the default InternalServerErrorException for unrecognized exceptions).
