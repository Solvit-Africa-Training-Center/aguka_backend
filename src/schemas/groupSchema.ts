import joi from "joi";

export const GroupCreationValidation=joi.object({

    name:joi.string().required(),
    description:joi.string().required(),
    location:joi.array().items(joi.string()).required(),
    faq:joi.string().required(),
    createdAt:joi.date().required()
})