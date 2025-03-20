import { StatusCodes } from "http-status-codes";

function getErrorJson(error) {
  return {
    name: error.name,
    message: error.message,
    action: error.action,
    status_code: error.statusCode,
  };
}

export class InternalServerError extends Error {
  constructor({ cause }) {
    super("unexpected internal server error", { cause });
    this.name = "InternalServerError";
    this.action = "contact support";
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }

  toJSON() {
    return getErrorJson(this);
  }
}

export class ServiceError extends Error {
  constructor({ cause }) {
    super("service unavailable", { cause });
    this.name = "ServiceError";
    this.action = "check if the service is available";
    this.statusCode = StatusCodes.SERVICE_UNAVAILABLE;
  }

  toJSON() {
    return getErrorJson(this);
  }
}

export class MethodNotAllowed extends Error {
  constructor({ cause }) {
    super("method not allowed for this endpoint", { cause });
    this.name = "MethodNotAllowed";
    this.action = "check if the HTTP method sent is valid for this endpoint";
    this.statusCode = StatusCodes.METHOD_NOT_ALLOWED;
  }

  toJSON() {
    return getErrorJson(this);
  }
}
