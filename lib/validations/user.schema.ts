import { z } from 'zod';

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
