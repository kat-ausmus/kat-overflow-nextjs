'use client';

import React from 'react';
import AuthForm from '@/components/forms/AuthForm';
import { SignInSchema } from '@/lib/validations/auth.schema';

import { signInWithCredentials } from '@/lib/actions/auth.action';

const Page = () => {
  return (
    <AuthForm
      formType="SIGN_IN"
      schema={SignInSchema}
      defaultValues={{ email: '', password: '' }}
      onSubmit={signInWithCredentials}
    />
  );
};
export default Page;
