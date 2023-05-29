import { PrismaClient } from '@prisma/client';
import HttpException from 'exceptions/HttpException';
import { DateTime } from 'luxon';
import { scrapeBCAExchangeRate } from 'services/kurs.service';
import KursTransformer from 'transformers/kurs.transformer';

const Kurs = new PrismaClient().kurs;

/**
 * Handle index the exchange rate.
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
export const index = async (req, res) => {
  const exchangeRatesToday = await scrapeBCAExchangeRate();

  // it will not insert the data if the data is already exist
  const data = await Kurs.createMany({
    data: KursTransformer.parser(exchangeRatesToday),
    skipDuplicates: true,
  });

  return res.status(200).json({
    message: 'success',
    data: data,
  });
};

/**
 * Handle get all the exchange rate.
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
export const getAll = async (req, res) => {
  const { symbol } = req.params;
  const { startdate, enddate } = req.query;
  let where = {};

  if (symbol) {
    where.symbol = symbol;
  }

  if (startdate && enddate) {
    where.date = {
      gte: DateTime.fromISO(startdate).toJSDate(),
      lte: DateTime.fromISO(enddate).toJSDate(),
    };
  }

  const exchangeRates = await Kurs.findMany({
    where,
    orderBy: {
      date: 'desc',
    },
  });

  return res.status(200).json({
    message: 'success',
    data: KursTransformer.formatter(exchangeRates),
  });
};

/**
 * Handle store the exchange rate.
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
export const store = async (req, res) => {
  const isCreated = await Kurs.findFirst({
    where: {
      date: DateTime.fromISO(req.body.date).toJSDate(),
      symbol: req.body.symbol,
    },
  });

  if (isCreated) {
    return res.status(200).json({
      message: 'success',
      data: KursTransformer.formatter(isCreated),
    });
  }

  const exchangeRate = await Kurs.create({
    data: KursTransformer.parser(req.body),
  });

  return res.status(201).json({
    message: 'success',
    data: KursTransformer.formatter(exchangeRate),
  });
};

/**
 * Handle show the exchange rate.
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
export const update = async (req, res) => {
  const { date, symbol } = req.body;
  const exchangeRate = await Kurs.findFirst({
    where: {
      date: DateTime.fromISO(date).toJSDate(),
      symbol,
    },
  });

  if (!exchangeRate) {
    throw new HttpException(404, 'Exchange rate not found');
  }

  const updateExchange = await Kurs.update({
    where: {
      id: exchangeRate.id,
    },
    data: KursTransformer.parser(req.body),
  });

  return res.status(200).json({
    message: 'success',
    data: KursTransformer.formatter(updateExchange),
  });
};

/**
 * Handle destroy the exchange rate.
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
export const destroy = async (req, res) => {
  const { date } = req.params;

  await Kurs.deleteMany({
    where: {
      date: DateTime.fromISO(date).toJSDate(),
    },
  });

  return res.status(200).json({});
};
