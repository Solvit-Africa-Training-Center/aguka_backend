import Joi from 'joi';

export const CreateFeedSchema = Joi.object({
  message: Joi.string().min(1).max(2000).required(),
});

export const CreateCommentSchema = Joi.object({
  message: Joi.string().min(1).max(1000).required(),
});

export const PaginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  cursor: Joi.string().optional(), 
});
