import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';
import { Request, Response } from 'express';

interface ErrorWithStatus extends Error {
  status?: number;
  code?: number;
}

interface ErrorContainer {
  errors: ((ErrorWithStatus & ErrorContainer) | string)[];
}

interface ErrorPayload {
  status: number;
  message: string;
  type?: string;
  errors?: ErrorPayload[];
}

const normalizeError = (error: (ErrorWithStatus & ErrorContainer) | string): ErrorPayload => {
  let status = 0;
  let message = 'Unknown Error';
  let errors;
  let type: string | undefined;
  if (typeof error === 'string') {
    status = 500;
    message = error;
  } else if (error.message) {
    status = error.status || 500;
    message = error.message;
    type = error.name;
  } else if (error.errors) {
    status = 500;
    message = 'Multiple Errors';
    errors = error.errors.map(row => normalizeError(row));
    if (errors.length === 1) {
      return errors[0];
    }
  }

  return { status, message, errors, type };
};

@Middleware({ type: 'after' })
export class JsonErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: (ErrorWithStatus & ErrorContainer) | string, request: Request, response: Response): void | Response {
    console.log('error found', typeof error);
    const errorPayload = normalizeError(error);
    response.status(errorPayload.status).json(errorPayload).end();
  }
}
