import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  SALT_ROUNDS: Joi.number().required(),
  JWT_SECRET: Joi.string().required(),
  REFRESH_TOKEN_SECRET: Joi.string().required(),
  FACEBOOK_APP_ID: Joi.string().required(),
  FACEBOOK_APP_SECRET: Joi.string().required(),
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  APPLE_CLIENT_ID: Joi.string().required(),
});
