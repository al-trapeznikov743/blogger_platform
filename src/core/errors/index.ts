export class NotFoundError extends Error {}

export class UserAlreadyExistError extends Error {
  constructor(
    public readonly field: string,
    public readonly message: string
  ) {
    super(message);

    this.name = this.constructor.name;
  }
}
