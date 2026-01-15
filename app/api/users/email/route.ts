import handleError from '@/lib/handlers/error';
import { APIErrorResponse } from '@/types/global';
import { UserSchema } from '@/lib/validations';
import { NotFoundError } from '@/lib/http-errors';
import User from '@/database/user.model';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';

export async function POST(request: Request) {
  const { email } = await request.json();
  try {
    const validatedEmail = UserSchema.partial().safeParse({ email });
    if (!validatedEmail.success) {
      return handleError(validatedEmail.error, 'api');
    }
    await dbConnect();
    const user = await User.findOne({ email });
    if (!user) return handleError(new NotFoundError('User'), 'api');

    return NextResponse.json(
      {
        success: true,
        data: user,
      },
      { status: 200 }
    );
  } catch (e) {
    return handleError(e, 'api') as APIErrorResponse;
  }
}
