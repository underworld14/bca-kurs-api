import Joi from 'joi';
import { DateTime } from 'luxon';

export const kurs = {
  body: Joi.object()
    .keys({
      symbol: Joi.string().required(),
      date: Joi.string().custom((value, helpers) => {
        const date = DateTime.fromISO(value);
        if (!date.isValid) {
          return helpers.error('date is invalid');
        }
        return value;
      }),
      e_rate: Joi.object()
        .keys({
          beli: Joi.number().required(),
          jual: Joi.number().required(),
        })
        .required(),
      tt_counter: Joi.object()
        .keys({
          beli: Joi.number().required(),
          jual: Joi.number().required(),
        })
        .required(),
      bank_notes: Joi.object()
        .keys({
          beli: Joi.number().required(),
          jual: Joi.number().required(),
        })
        .required(),
    })
    .strict(),
};
