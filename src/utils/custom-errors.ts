export class ValidationError extends Error {
  statusCode = 400;

  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends Error {
  statusCode = 404;

  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ConflictError extends Error {
  statusCode = 409;

  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
    Error.captureStackTrace(this, this.constructor);
  }
}

export class UnauthorizedError extends Error {
  statusCode = 401;

  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ForbiddenError extends Error {
  statusCode = 403;

  constructor(message: string) {
    super(message);
    this.name = "ForbiddenError";
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends Error {
  statusCode = 400;

  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
    Error.captureStackTrace(this, this.constructor);
  }
}

export class InternalServerError extends Error {
  statusCode = 500;

  constructor(message: string = "Internal Server Error") {
    super(message);
    this.name = "InternalServerError";
    Error.captureStackTrace(this, this.constructor);
  }
}
