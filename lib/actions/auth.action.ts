'use server';

import { ActionResponse } from '@/types/global';
import { SignInSchema, SignUpSchema } from '@/lib/validations';
import handleError from '@/lib/handlers/error';
import { action } from '@/lib/handlers/action';
import User from '@/database/user.model';
import Account, { IAccountDocument } from '@/database/account.model';
import mongoose from 'mongoose';
import { AuthCredentials } from '@/types/action';
import dbConnect from '@/lib/mongoose';
import { NotFoundError, UnauthorizedError } from '@/lib/http-errors';
import logger from '@/lib/logger';

export async function signUpWithCredentials(params: AuthCredentials): Promise<ActionResponse> {
  const validationResult = await action({ params, schema: SignUpSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ActionResponse;
  }

  const { name, username, email, password } = params;

  await dbConnect();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingUser = await User.findOne({ email }).session(session);

    if (existingUser) {
      return handleError(new Error('User already exists')) as ActionResponse;
    }

    const existingUsername = await User.findOne({ username }).session(session);

    if (existingUsername) {
      return handleError(new Error('Username already exists')) as ActionResponse;
    }

    const [firstName, lastName = ''] = name.split(' ');

    const [newUser] = await User.create(
      [
        {
          username,
          firstName,
          lastName,
          email,
        },
      ],
      {
        session,
      }
    );

    await Account.create(
      [
        {
          userId: newUser._id,
          name,
          provider: 'credentials',
          providerAccountId: email,
          password,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    return { success: true };
  } catch (error) {
    try {
      await session.abortTransaction();
    } catch (abort_error) {
      logger.info('Abort transaction failed:');
    }
    return handleError(error) as ActionResponse;
  } finally {
    await session.endSession();
  }
}

export async function signInWithCredentials(
  params: Pick<AuthCredentials, 'email' | 'password'>
): Promise<ActionResponse> {
  const validationResult = await action({ params, schema: SignInSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ActionResponse;
  }

  try {
    const { email, password } = params;

    await dbConnect();

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return handleError(new NotFoundError('User')) as ActionResponse;
    }

    const existingAccount: IAccountDocument | null = await Account.findOne({
      provider: 'credentials',
      providerAccountId: email,
    });

    if (!existingAccount) {
      return handleError(new NotFoundError('Account')) as ActionResponse;
    }

    const isPasswordCorrect = await existingAccount.comparePassword(password);

    if (!isPasswordCorrect) {
      return handleError(new UnauthorizedError('Invalid credentials')) as ActionResponse;
    }

    return { success: true };
  } catch (error) {
    return handleError(error) as ActionResponse;
  }
}
