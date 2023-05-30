export const cleanScrappedNumber = (scrappedNumber) => {
  return parseFloat(
    scrappedNumber
      .trim()
      .replaceAll('\n', '')
      .replaceAll('\t', '')
      .replaceAll(' ', '')
      .replaceAll('.', '')
      .replaceAll(',', '.'),
  );
};
