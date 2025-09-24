import Joi from 'joi';

export const AnnouncementCreateSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  meetingDate: Joi.date().iso().required(), // YYYY-MM-DD
  meetingTime: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required(), // HH:mm
  location: Joi.string().max(255).required(),
  agenda: Joi.string().min(1).required(),
});

export const AnnouncementUpdateSchema = Joi.object({
  title: Joi.string().min(3).max(255).optional(),
  meetingDate: Joi.date().iso().optional(),
  meetingTime: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .optional(),
  location: Joi.string().max(255).optional(),
  agenda: Joi.string().optional(),
  status: Joi.string().valid('scheduled', 'completed', 'postponed').optional(),
  attendeesCount: Joi.number().integer().min(0).optional(),
});
