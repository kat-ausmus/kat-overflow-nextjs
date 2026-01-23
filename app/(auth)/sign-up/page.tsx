'use client';

import React from 'react';
import AuthForm from '@/components/forms/AuthForm';
import { SignUpSchema } from '@/lib/validations/auth.schema';
import { signUpWithCredentials } from '@/lib/actions/auth.action';

const Page = () => {
  return (
    <AuthForm
      formType="SIGN_UP"
      schema={SignUpSchema}
      defaultValues={{ email: '', password: '', username: '', name: '' }}
      onSubmit={signUpWithCredentials}
    />
  );
};
export default Page;
