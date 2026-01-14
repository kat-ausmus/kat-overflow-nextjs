import { ErrorRecordType } from '@/lib/error-types';
import { ZodError } from 'zod';

interface ErrorParams {
  statusCode: number;
  message: string;
  errors?: ErrorRecordType;
}

export class RequestError extends Error {
  statusCode: number;
  errors?: ErrorRecordType;
  constructor({ statusCode, message, errors }: ErrorParams) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = this.constructor.name;
  }
}

// 400++

export class ValidationError extends RequestError {
  constructor(errors: ZodError) {
    const formattedErrors = ValidationError.formatFieldErrors(errors);
    super({
      statusCode: 400,
      message: 'Validation Error',
      errors: formattedErrors,
    });
  }

  static formatFieldErrors(errors: ZodError): ErrorRecordType {
    const fieldErrors: ErrorRecordType = {};
    errors.issues.forEach((issue) => {
      const path = issue.path.join('.');
      if (!fieldErrors[path]) {
        fieldErrors[path] = [];
      }
      fieldErrors[path].push(issue.message);
    });

    return fieldErrors;
  }
}

export class NotFoundError extends RequestError {
  constructor(resource: string) {
    super({ statusCode: 404, message: resource + ' not found' });
  }
}
class UnauthorizedError extends RequestError {
  constructor(message: string) {
    super({ statusCode: 401, message });
  }
}

class ForbiddenError extends RequestError {
  constructor(message: string) {
    super({ statusCode: 403, message });
  }
}

class TooManyRequestsError extends RequestError {
  constructor(message: string) {
    super({ statusCode: 429, message });
  }
}

// 500++
class InternalServerError extends RequestError {
  constructor(message: string) {
    super({ statusCode: 500, message });
  }
}

class ServiceUnavailableError extends RequestError {
  constructor(message: string) {
    super({ statusCode: 503, message });
  }
}
