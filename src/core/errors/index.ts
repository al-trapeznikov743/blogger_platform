export class NotFoundError extends Error {
  constructor(
    public readonly field: string,
    message: string
  ) {
    super(message);

    this.name = this.constructor.name;
  }
}

export class BadRequestError extends Error {
  constructor(
    public readonly field: string,
    message: string
  ) {
    super(message);

    this.name = this.constructor.name;
  }
}

export class ForbiddenError extends Error {
  constructor(
    public readonly field: string,
    message: string
  ) {
    super(message);

    this.name = this.constructor.name;
  }
}

export class UnauthorizedError extends Error {}
