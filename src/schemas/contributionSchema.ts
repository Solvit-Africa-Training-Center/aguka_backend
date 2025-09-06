import Joi from 'joi';

export const ContributionValidation = Joi.object({
  userId: Joi.string().uuid().required(),
  groupId: Joi.string().length(6).required(),
  amount: Joi.number().positive().required(),
  paymentMethod: Joi.string().valid('cash', 'bank', 'momo').required(),
  contributionDate: Joi.date().default(() => new Date()),
  recordedBy: Joi.string().uuid().optional(), // Will be set automatically from logged-in user
});

export const ContributionUpdateValidation = Joi.object({
  amount: Joi.number().positive().optional(),
  paymentMethod: Joi.string().valid('cash', 'bank', 'momo').optional(),
});
