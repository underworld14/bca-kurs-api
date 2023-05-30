import { expect } from 'chai';
import { DateTime } from 'luxon';
import KursTransformer from 'transformers/kurs.transformer';

const toParse = {
  date: '2023-05-30',
  symbol: 'SEK',
  e_rate: {
    beli: 1363.23,
    jual: 1402.69,
  },
  tt_counter: {
    beli: 1361.85,
    jual: 1407.35,
  },
  bank_notes: {
    beli: 1342,
    jual: 1400,
  },
};

const toFormat = {
  date: DateTime.fromISO(toParse.date).toJSDate(),
  symbol: 'SEK',
  e_rate_buy: 1363.23,
  e_rate_sell: 1402.69,
  tt_counter_buy: 1361.85,
  tt_counter_sell: 1407.35,
  bank_notes_buy: 1342,
  bank_notes_sell: 1400,
};

describe('KursTransformer', () => {
  it('Should able to parse kurs data', () => {
    const parsed = KursTransformer.parser(toParse);

    expect(parsed).to.deep.equal({
      date: DateTime.fromISO(toParse.date).toJSDate(),
      symbol: 'SEK',
      e_rate_buy: 1363.23,
      e_rate_sell: 1402.69,
      tt_counter_buy: 1361.85,
      tt_counter_sell: 1407.35,
      bank_notes_buy: 1342,
      bank_notes_sell: 1400,
    });
  });

  it('Should able to parse kurs data array', () => {
    const parsed = KursTransformer.parser([toParse, toParse]);

    expect(parsed).to.deep.equal([
      {
        date: DateTime.fromISO(toParse.date).toJSDate(),
        symbol: 'SEK',
        e_rate_buy: 1363.23,
        e_rate_sell: 1402.69,
        tt_counter_buy: 1361.85,
        tt_counter_sell: 1407.35,
        bank_notes_buy: 1342,
        bank_notes_sell: 1400,
      },
      {
        date: DateTime.fromISO(toParse.date).toJSDate(),
        symbol: 'SEK',
        e_rate_buy: 1363.23,
        e_rate_sell: 1402.69,
        tt_counter_buy: 1361.85,
        tt_counter_sell: 1407.35,
        bank_notes_buy: 1342,
        bank_notes_sell: 1400,
      },
    ]);
  });

  it('Should able to format kurs data', () => {
    const formatted = KursTransformer.formatter(toFormat);

    expect(formatted).to.deep.equal({
      date: DateTime.fromJSDate(toFormat.date).toFormat('yyyy-MM-dd'),
      symbol: 'SEK',
      e_rate: {
        beli: 1363.23,
        jual: 1402.69,
      },
      tt_counter: {
        beli: 1361.85,
        jual: 1407.35,
      },
      bank_notes: {
        beli: 1342,
        jual: 1400,
      },
    });
  });

  it('Should able to format kurs data array', () => {
    const formatted = KursTransformer.formatter([toFormat, toFormat]);
    expect(formatted).to.deep.equal([
      {
        date: DateTime.fromJSDate(toFormat.date).toISODate(),
        symbol: 'SEK',
        e_rate: {
          beli: 1363.23,
          jual: 1402.69,
        },
        tt_counter: {
          beli: 1361.85,
          jual: 1407.35,
        },
        bank_notes: {
          beli: 1342,
          jual: 1400,
        },
      },
      {
        date: DateTime.fromJSDate(toFormat.date).toISODate(),
        symbol: 'SEK',
        e_rate: {
          beli: 1363.23,
          jual: 1402.69,
        },
        tt_counter: {
          beli: 1361.85,
          jual: 1407.35,
        },
        bank_notes: {
          beli: 1342,
          jual: 1400,
        },
      },
    ]);
  });
});
