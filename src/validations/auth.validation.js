import Joi from 'joi';

export const register = {
  body: Joi.object()
    .keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(5).required(),
      name: Joi.string().required(),
      role: Joi.string(),
    })
    .strict(),
};

export const login = {
  body: Joi.object()
    .keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(5).required(),
    })
    .strict(),
};
