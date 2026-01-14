import { z } from 'zod';

export const SignInSchema = z.object({
  email: z.email({ message: 'Please enter a valid email' }).min(1, { message: 'Email is required' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .max(100, { message: 'Password must be less than 100 characters long' }),
});
export type SignInSchemaType = z.infer<typeof SignInSchema>;

export const SignUpSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters long.' })
    .max(30, { message: 'Username cannot exceed 30 characters.' })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: 'Username can only contain letters, numbers, and underscores.',
    }),

  name: z
    .string()
    .min(1, { message: 'Name is required.' })
    .max(50, { message: 'Name cannot exceed 50 characters.' })
    .regex(/^[a-zA-Z\s]+$/, {
      message: 'Name can only contain letters and spaces.',
    }),

  email: z.email({ message: 'Please provide a valid email address.' }).min(1, { message: 'Email is required.' }),

  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long.' })
    .max(100, { message: 'Password cannot exceed 100 characters.' })
    .regex(/[A-Z]/, {
      message: 'Password must contain at least one uppercase letter.',
    })
    .regex(/[a-z]/, {
      message: 'Password must contain at least one lowercase letter.',
    })
    .regex(/[0-9]/, { message: 'Password must contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Password must contain at least one special character.',
    }),
});
export type SignUpSchemaType = z.infer<typeof SignUpSchema>;

export const AskQuestionSchema = z.object({
  title: z
    .string()
    .min(5, { message: 'Title is required.' })
    .max(100, { message: 'Title cannot exceed 100 characters.' }),

  content: z.string().min(1, { message: 'Body is required.' }),
  tags: z
    .array(z.string().min(1, { message: 'Tag is required.' }).max(30, { message: 'Tag cannot exceed 30 characters.' }))
    .min(1, { message: 'At least one tag is required.' })
    .max(3, { message: 'Cannot add more than 3 tags.' }),
});
export type AskQuestionSchemaType = z.infer<typeof AskQuestionSchema>;

export const UserSchema = z
  .object({
    firstName: z
      .string()
      .min(1, { message: 'First Name is required.' })
      .max(50, { message: 'First Name cannot exceed 50 characters.' }),
    lastName: z
      .string()
      .min(1, { message: 'Last Name is required.' })
      .max(50, { message: 'Last Name cannot exceed 50 characters.' }),
    username: z
      .string()
      .min(3, { message: 'Username must be at least 3 characters long.' })
      .max(30, { message: 'Username cannot exceed 30 characters.' }),
    email: z.email({ message: 'Please provide a valid email address.' }),
    bio: z.string().max(250, { message: 'Bio cannot exceed 250 characters.' }).optional(),
    image: z.url({ message: 'Please provide a valid image URL.' }).optional(),
    location: z.string().optional(),
    portfolio: z.url({ message: 'Please provide a valid portfolio URL.' }).optional(),
    reputation: z.number().min(0, { message: 'Reputation cannot be negative.' }),
  })
  .strict();
export type UserSchemaType = z.infer<typeof UserSchema>;
