import { z } from 'zod';

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

export const EditQuestionSchema = AskQuestionSchema.extend({
  questionId: z.string().min(1, { message: 'Question ID is required.' }),
});

export const GetQuestionSchema = z.object({
  questionId: z.string().min(1, { message: 'Question ID' }),
});
