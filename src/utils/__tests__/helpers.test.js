import { expect } from 'chai';
import { cleanScrappedNumber } from 'utils/helpers';

describe('helpers', () => {
  it('should clean scrapped number', () => {
    const scrappedNumber = '\t\t\t14.000,5\n\n\n';
    const expected = 14000.5;

    const scrappedNumber1 = '    14.000,5    ';
    const expected1 = 14000.5;

    expect(cleanScrappedNumber(scrappedNumber)).to.equal(expected);
    expect(cleanScrappedNumber(scrappedNumber1)).to.equal(expected1);
  });
});
