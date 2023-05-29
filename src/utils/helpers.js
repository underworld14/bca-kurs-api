export const cleanScrappedNumber = (scrappedNumber) => {
  return parseFloat(
    scrappedNumber
      .replaceAll('\n', '')
      .replaceAll('\t', '')
      .replaceAll(' ', '')
      .replaceAll('.', '')
      .replaceAll(',', '.'),
  );
};
