'use server';

import { ActionResponse } from '@/types/global';
import { SignInSchema, SignUpSchema } from '@/lib/validations';
import handleError from '@/lib/handlers/error';
import { action } from '@/lib/handlers/action';
import User from '@/database/user.model';
import bcrypt from 'bcrypt';
import Account from '@/database/account.model';
import mongoose from 'mongoose';
import { AuthCredentials } from '@/types/action';
import dbConnect from '@/lib/mongoose';

export async function signUpWithCredentials(params: AuthCredentials): Promise<ActionResponse> {
  const validationResult = await action({ params, schema: SignUpSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ActionResponse;
  }

  const { name, username, email, password } = params;
  console.log({ params });

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

    const hashedPassword = await bcrypt.hash(password, 12);
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
          password: hashedPassword,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    return { success: true };
  } catch (error) {
    await session.abortTransaction();

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
      throw new Error('User does not exist');
    }

    const existingAccount = await Account.findOne({
      provider: 'credentials',
      providerAccountId: email,
    });

    if (!existingAccount) {
      throw new Error('Account does not exist');
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingAccount.password);

    if (!isPasswordCorrect) {
      throw new Error('Invalid password');
    }

    return { success: true };
  } catch (error) {
    return handleError(error) as ActionResponse;
  }
}
