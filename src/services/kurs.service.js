import axios from 'axios';
import { DateTime } from 'luxon';
import cheerio from 'cheerio';
import { cleanScrappedNumber } from 'utils/helpers';

/**
 * Scrape the exchange rate from BCA.
 */
export const scrapeBCAExchangeRate = async () => {
  const exchangeRatesToday = [];

  const kursHtml = await axios.get('https://www.bca.co.id/id/informasi/kurs');
  const $ = cheerio.load(kursHtml.data);

  $('.m-table-kurs tbody tr').each((i, el) => {
    const kurs = {
      date: DateTime.fromFormat($('.refresh-date').first().text(), 'dd MMMM yyyy HH.mm', {
        locale: 'id',
      })
        .startOf('day')
        .toISODate(),
      symbol: $(el).attr('code'),
      e_rate: {
        beli: cleanScrappedNumber($(el).find('td:nth-child(2)').text()),
        jual: cleanScrappedNumber($(el).find('td:nth-child(3)').text()),
      },
      tt_counter: {
        beli: cleanScrappedNumber($(el).find('td:nth-child(4)').text()),
        jual: cleanScrappedNumber($(el).find('td:nth-child(5)').text()),
      },
      bank_notes: {
        beli: cleanScrappedNumber($(el).find('td:nth-child(6)').text()),
        jual: cleanScrappedNumber($(el).find('td:nth-child(7)').text()),
      },
    };
    exchangeRatesToday.push(kurs);
  });

  return exchangeRatesToday;
};
