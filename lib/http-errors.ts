import { ErrorRecordType } from '@/lib/error-types';

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
  constructor(errors: ErrorRecordType) {
    const formattedMsg = ValidationError.formatFieldErrors(errors);
    super({ statusCode: 400, message: formattedMsg, errors });
  }

  static formatFieldErrors(errors: ErrorRecordType) {
    console.log('inside formatFieldErrors!', errors);
    const formattedMessages = Object.entries(errors).map(([field, messages]) => {
      const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
      if (messages[0].toLowerCase() === 'required') return `${fieldName} is required`;
      else {
        return messages.join(' and ');
      }
    });
    return formattedMessages.join('; ');
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
