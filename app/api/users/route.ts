import handleError from '@/lib/handlers/error';
import dbConnect from '@/lib/mongoose';
import User from '@/database/user.model';
import { NextResponse } from 'next/server';
import { APIErrorResponse } from '@/types/global';
import { UserSchema } from '@/lib/validations/user.schema';
import logger from '@/lib/logger';

export async function GET() {
  try {
    await dbConnect();
    const users = await User.find();
    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error) {
    return handleError(error, 'api') as APIErrorResponse;
  }
}

export async function POST(request: Request) {
  try {
    logger.info('Creating a new user...');
    const body = await request.json();
    const validatedUser = UserSchema.safeParse(body);
    if (!validatedUser.success) {
      return handleError(validatedUser.error, 'api');
    }

    await dbConnect();

    const { username, email } = validatedUser.data;

    const existingUser = await User.findOne({ email, username });
    if (existingUser) {
      return handleError(new Error('User already exists'), 'api');
    }
    const newUser = await User.create(validatedUser.data);
    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  } catch (error) {
    return handleError(error, 'api') as APIErrorResponse;
  }
}
