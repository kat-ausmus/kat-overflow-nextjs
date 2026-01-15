import { NotFoundError } from '@/lib/http-errors';
import dbConnect from '@/lib/mongoose';
import Account from '@/database/account.model';
import { NextResponse } from 'next/server';
import handleError from '@/lib/handlers/error';
import { APIErrorResponse } from '@/types/global';
import { AccountSchema } from '@/lib/validations';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) throw new NotFoundError('Account not found');

  try {
    await dbConnect();
    const account = await Account.findById(id);
    if (!account) return handleError(new NotFoundError('Account not found'), 'api');
    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (error) {
    return handleError(error, 'api') as APIErrorResponse;
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) return handleError(new NotFoundError('Account not found'), 'api');

  try {
    await dbConnect();
    const account = await Account.findByIdAndDelete(id);
    if (!account) return handleError(new NotFoundError('Account not found'), 'api');
    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (error) {
    return handleError(error, 'api') as APIErrorResponse;
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) throw new NotFoundError('Account not found');
  try {
    const body = await request.json();
    const validatedData = AccountSchema.safeParse(body);

    await dbConnect();
    const updatedAccount = await Account.findByIdAndUpdate(id, validatedData, { new: true });
    if (!updatedAccount) return handleError(new NotFoundError('Account not found'), 'api');
    return NextResponse.json({ success: true, data: updatedAccount }, { status: 200 });
  } catch (error) {
    return handleError(error, 'api') as APIErrorResponse;
  }
}
