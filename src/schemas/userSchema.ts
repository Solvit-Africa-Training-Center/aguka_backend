import joi, { object } from 'joi'


export enum RoleEnum{
    ADMIN='admin',
    PRESIDENT='president',
    SECRETARY='secretary',
    TREASURER='treasurer',
    USER='user'
}

export const userCreationValidation = joi.object({
    name:joi.string().required(),
    email:joi.string().email().required(),
    phoneNumber:joi.string().required(),
    password:joi.string().min(6).required(),
    role:joi.string().valid(...Object.values(RoleEnum)),
    groupId:joi.string().optional()
})

export const LoginUserSchema= joi.object({
    email:joi.string().email(),
    phoneNumber:joi.string(),
    password:joi.string().required()
})