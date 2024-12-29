import { StatusCodes } from "http-status-codes";

function createSelectiveCopy(source, publicList) {
  if (typeof source !== "object" || source === null) {
    return {};
  }
  if (!Array.isArray(publicList)) {
    return {};
  }

  return publicList.reduce((acc, key) => {
    acc[key] = source[key];
    return acc;
  }, {});
}

export class InternalServerError extends Error {
  constructor({ cause }) {
    super("unexpected internal server error", { cause });
    this.name = "InternalServerError";
    this.action = "contact support";
    this.status_code = StatusCodes.INTERNAL_SERVER_ERROR;
  }

  toJSON() {
    return createSelectiveCopy(this, ["name", "action", "status_code"]);
  }
}
