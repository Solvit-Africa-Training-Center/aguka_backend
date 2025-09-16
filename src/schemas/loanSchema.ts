import joi from 'joi';

export const loanCreationValidation = joi.object({
  amount: joi.number().positive().required(),
  startDate: joi.date().required(),
  dueDate: joi.date().greater(joi.ref('startDate')).required(),
});
