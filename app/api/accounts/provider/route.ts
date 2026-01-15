import handleError from '@/lib/handlers/error';
import { APIErrorResponse } from '@/types/global';
import { AccountSchema } from '@/lib/validations';
import { NotFoundError } from '@/lib/http-errors';
import { NextResponse } from 'next/server';
import Account from '@/database/account.model';

export async function POST(request: Request) {
  const { providerAccountId } = await request.json();
  try {
    const validatedAccount = AccountSchema.partial().safeParse({ providerAccountId });
    if (!validatedAccount.success) {
      return handleError(validatedAccount.error, 'api');
    }
    const account = await Account.findOne({ providerAccountId });
    if (!account) handleError(new NotFoundError('Account'), 'api');

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
