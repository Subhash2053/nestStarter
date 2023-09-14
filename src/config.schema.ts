import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  SALT_ROUNDS: Joi.number().required(),
  JWT_SECRET: Joi.string().required(),
});
