export const generateFakePayment = () => {
  const randomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const fakeBillNumbers = ["BN123", "BN456", "BN789"];
  const billNumber = fakeBillNumbers[randomInt(0, fakeBillNumbers.length - 1)];

  return {
    billNumber,
    amountPaid: randomInt(100, 500),
    bankReference: `REF${randomInt(100000, 999999)}`,
    paidAt: new Date().toISOString(),
  };
};
// This function generates a fake payment object with random values for testing purposes.
