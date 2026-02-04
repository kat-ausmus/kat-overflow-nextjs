import handleError from '@/lib/handlers/error';
import { APIErrorResponse } from '@/types/global';
import { AccountSchema } from '@/lib/validations';
import { NotFoundError } from '@/lib/http-errors';
import { NextResponse } from 'next/server';
import Account, { IAccountDocument } from '@/database/account.model';

export async function POST(request: Request) {
  const { providerAccountId, password } = await request.json();
  try {
    const validatedAccount = AccountSchema.partial().safeParse({ providerAccountId, password });
    if (!validatedAccount.success) {
      return handleError(validatedAccount.error, 'api');
    }
    const account: IAccountDocument | null = await Account.findOne({ providerAccountId });
    if (!account) return handleError(new NotFoundError('Account'), 'api');
    if (password) {
      const validPassword = await account.comparePassword(password);
      if (!validPassword) return handleError(new Error('Invalid credentials.'), 'api');
    }

    return NextResponse.json(
      {
        success: true,
        data: account,
      },
      { status: 200 }
    );
  } catch (e) {
    return handleError(e, 'api') as APIErrorResponse;
  }
}
