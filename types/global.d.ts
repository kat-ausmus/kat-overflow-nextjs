import { ErrorRecordType } from '@/lib/error-types';
import { NextResponse } from 'next/server';

export interface Tag {
  _id: string;
  name: string;
}

export interface Author {
  _id: string;
  name: string;
  image?: string;
}

export interface Question {
  _id: string;
  title: string;
  description: string;
  tags: Tag[];
  author: Author;
  createdAt: Date;
  upvotes: number;
  answers: number;
  views: number;
}

export type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: ErrorRecordType;
    statusCode?: number;
  };
  status?: number;
};

export type SuccessResponse<T = null> = ActionResponse<T> & { success: true };
export type ErrorResponse<T> = ActionResponse<T> & { success: false };

export type APIErrorResponse = NextResponse<ErrorResponse<any>>;
export type APIResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse<T>>;
