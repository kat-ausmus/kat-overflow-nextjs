'use server';

import { ZodError, ZodSchema } from 'zod';
import { UnauthorizedError, ValidationError } from '../http-errors';
import { auth } from '@/auth';
import { Session } from 'next-auth';
import dbConnect from '@/lib/mongoose';

type ActionOptions<T> = {
  params?: T;
  schema?: ZodSchema<T>;
  authorize?: boolean;
};

export async function action<T>({ params, schema, authorize = false }: ActionOptions<T>) {
  if (schema && params) {
    try {
      schema.parse(params);
    } catch (error) {
      if (error instanceof ZodError) {
        return new ValidationError(error);
      }
      return new Error('Schema validation failed.');
    }
  }
  let session: Session | null = null;
  if (authorize) {
    session = await auth();
    if (!session) {
      return new UnauthorizedError('Action requires authentication');
    }

    await dbConnect();
    return { params, session };
  }
}
