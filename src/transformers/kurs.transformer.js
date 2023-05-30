import { DateTime } from 'luxon';

export default class KursTransformer {
  static parser(data) {
    if (Array.isArray(data)) {
      return data.map(KursTransformer.parser);
    }
    return {
      date: DateTime.fromISO(data.date).toJSDate(),
      symbol: data.symbol,
      e_rate_buy: data.e_rate.beli,
      e_rate_sell: data.e_rate.jual,
      tt_counter_buy: data.tt_counter.beli,
      tt_counter_sell: data.tt_counter.jual,
      bank_notes_buy: data.bank_notes.beli,
      bank_notes_sell: data.bank_notes.jual,
    };
  }

  static formatter(data) {
    if (Array.isArray(data)) {
      return data.map(KursTransformer.formatter);
    }
    return {
      date: DateTime.fromJSDate(data.date).toISODate(),
      symbol: data.symbol,
      e_rate: {
        beli: data.e_rate_buy,
        jual: data.e_rate_sell,
      },
      tt_counter: {
        beli: data.tt_counter_buy,
        jual: data.tt_counter_sell,
      },
      bank_notes: {
        beli: data.bank_notes_buy,
        jual: data.bank_notes_sell,
      },
    };
  }
}
