import joi from 'joi';

export const AddUserSchema = joi.object({
  name: joi.string().required(),
});
