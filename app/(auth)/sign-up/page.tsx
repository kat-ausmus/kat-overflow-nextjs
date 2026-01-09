'use client';

import React from 'react';
import AuthForm from '@/components/forms/AuthForm';
import { SignUpSchema } from '@/lib/validations';

const Page = () => {
  return (
    <AuthForm
      formType="SIGN_UP"
      schema={SignUpSchema}
      defaultValues={{ email: '', password: '', username: '', name: '' }}
      onSubmit={(data) => Promise.resolve({ success: true, data: { email: data.email } })}
    />
  );
};
export default Page;
