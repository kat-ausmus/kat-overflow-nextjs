'use server';

import mongoose, { QueryFilter } from 'mongoose';

import { ActionResponse, ErrorResponse, PaginatedSearchParams, Question as QuestionType } from '@/types/global';
import QuestionCollection, { IQuestionDocument } from '@/database/question.model';
import TagQuestion from '@/database/tag-question.model';
import Tag, { ITagDocument } from '@/database/tag.model';

import { action } from '../handlers/action';
import handleError from '../handlers/error';
import { AskQuestionSchema, EditQuestionSchema, GetQuestionSchema, PaginatedSearchParamsSchema } from '../validations';
import { CreateQuestionParams, EditQuestionParams, GetQuestionParams } from '@/types/action';
import dbConnect from '@/lib/mongoose';

export async function createQuestion(params: CreateQuestionParams): Promise<ActionResponse<IQuestionDocument>> {
  const validationResult = await action({
    params,
    schema: AskQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse<IQuestionDocument>;
  }

  const { title, content, tags } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  await dbConnect();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [question] = await QuestionCollection.create([{ title, content, author: userId }], { session });

    if (!question) {
      return handleError(new Error('Failed to create question')) as ErrorResponse<IQuestionDocument>;
    }

    const tagIds: mongoose.Types.ObjectId[] = [];
    const tagQuestionDocuments = [];

    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, 'i') } },
        { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
        { upsert: true, returnDocument: 'after', session }
      );

      tagIds.push(existingTag._id);
      tagQuestionDocuments.push({
        tag: existingTag._id,
        question: question._id,
      });
    }

    await TagQuestion.insertMany(tagQuestionDocuments, { session });

    await QuestionCollection.findByIdAndUpdate(question._id, { $push: { tags: { $each: tagIds } } }, { session });

    await session.commitTransaction();

    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse<IQuestionDocument>;
  } finally {
    await session.endSession();
  }
}

export async function editQuestion(params: EditQuestionParams): Promise<ActionResponse<IQuestionDocument>> {
  const validationResult = await action({
    params,
    schema: EditQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse<IQuestionDocument>;
  }

  const { title, content, tags, questionId } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  await dbConnect();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [question] = await QuestionCollection.findById(questionId).populate('tags');

    if (!question) {
      return handleError(new Error('Failed to find question')) as ErrorResponse<IQuestionDocument>;
    }

    if (question.author.toString() !== userId) {
      return handleError(new Error('Unauthorized')) as ErrorResponse<IQuestionDocument>;
    }

    question.title = title;
    question.content = content;

    const tagsToAdd = tags.filter((tag) => !question.tags.includes(tag.toLowerCase()));
    const tagsToRemove = question.tags.filter((tag: ITagDocument) => !tags.includes(tag.name.toLowerCase()));

    const newTagDocuments = [];
    if (tagsToAdd.length > 0) {
      for (const tag of tagsToAdd) {
        const existingTag = await Tag.findOneAndUpdate(
          { name: { $regex: new RegExp(`^${tag}$`, 'i') } },
          { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
          { upsert: true, returnDocument: 'after', session }
        );
        if (existingTag) {
          newTagDocuments.push({
            tag: existingTag._id,
            question: question._id,
          });

          question.tags.push(existingTag._id);
        }
      }
    }

    if (tagsToRemove.length > 0) {
      const tagIdsToRemove = tagsToRemove.map((tag: ITagDocument) => tag._id);

      await Tag.updateMany({ _id: { $in: tagIdsToRemove } }, { $inc: { questions: -1 } }, { session });

      await TagQuestion.deleteMany({ tag: { $in: tagIdsToRemove }, question: questionId }, { session });

      question.tags = question.tags.filter((tagId: mongoose.Types.ObjectId) => !tagsToRemove.includes(tagId));
    }

    if (newTagDocuments.length > 0) {
      await TagQuestion.insertMany(newTagDocuments, { session });
    }

    await question.save({ session });
    await session.commitTransaction();

    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse<IQuestionDocument>;
  } finally {
    await session.endSession();
  }
}

export async function getQuestion(params: GetQuestionParams): Promise<ActionResponse<IQuestionDocument>> {
  const validationResult = await action({
    params,
    schema: GetQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse<IQuestionDocument>;
  }

  const { questionId } = validationResult.params!;

  await dbConnect();

  try {
    const question = await QuestionCollection.findById(questionId).populate('tags');

    if (!question) {
      return handleError(new Error('Question not found')) as ErrorResponse<IQuestionDocument>;
    }

    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    return handleError(error) as ErrorResponse<IQuestionDocument>;
  }
}

interface IQuestions {
  questions: QuestionType[];
  isNext: boolean;
}
export async function getQuestions(params: PaginatedSearchParams): Promise<ActionResponse<IQuestions>> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse<IQuestions>;
  }

  const { page = 1, pageSize = 10, query, filter } = params;
  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);

  const filterQuery: QueryFilter<IQuestions> = {};

  if (filter === 'recommended') {
    return { success: true, data: { questions: [], isNext: false } };
  }

  if (query) {
    filterQuery.$or = [{ title: { $regex: new RegExp(query, 'i') } }, { content: { $regex: new RegExp(query, 'i') } }];
  }

  let sortCriteria;

  switch (filter) {
    case 'newest':
      sortCriteria = { createdAt: -1 };
      break;
    case 'unanswered':
      filterQuery.answers = 0;
      sortCriteria = { createdAt: -1 };
      break;
    case 'popular':
      sortCriteria = { upvotes: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    const totalQuestions = await QuestionCollection.countDocuments(filterQuery);

    const questions = await QuestionCollection.find(filterQuery)
      .populate('tags', 'name')
      .populate('author', 'name image')
      .lean()
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const isNext = totalQuestions > skip + questions.length;

    return {
      success: true,
      data: { questions: JSON.parse(JSON.stringify(questions)), isNext },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse<IQuestions>;
  }
}
