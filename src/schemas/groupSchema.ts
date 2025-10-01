import joi from 'joi';

export const GroupCreationValidation = joi.object({
  name: joi.string().required(),
  description: joi.string().required(),
  location: joi.array().items(joi.string()).required(),
  profilePicture: joi.string().uri().optional(),
  meetingLocation: joi.string().optional(),
  interestRate: joi.number().min(0).optional(),
  contact: joi.string().optional(),
  email: joi.string().email().optional(),
  minContribution: joi.number().positive().required(),
  agreementTerms: joi.string().optional(),
});

export const GroupUpdateValidation = joi.object({
  name: joi.string().optional(),
  description: joi.string().optional(),
  location: joi.array().items(joi.string()).optional(),
  profilePicture: joi.string().uri().optional(),
  meetingLocation: joi.string().optional(),
  interestRate: joi.number().min(0).optional(),
  contact: joi.string().optional(),
  email: joi.string().email().optional(),
  minContribution: joi.number().positive().optional(),
  agreementTerms: joi.string().optional(),
});
