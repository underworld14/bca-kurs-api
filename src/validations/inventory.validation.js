import Joi from 'joi';

export const create = {
  body: Joi.object()
    .keys({
      description: Joi.string().required(),
      roomCode: Joi.string().required(),
      roomDescription: Joi.string().required(),
    })
    .strict(),
};

export const update = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      description: Joi.string(),
      roomCode: Joi.string(),
      roomDescription: Joi.string(),
    })
    .strict(),
};
