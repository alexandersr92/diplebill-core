export const calculateTotalDiscount = (
  input: string,
  subtotal: number
): { percentage: number; fixed: number; discount: number } => {
  let discount = 0;
  const result = { percentage: 0, fixed: 0 };

  if (input.endsWith('%')) {
    const percentage = parseFloat(input.slice(0, -1));
    if (!isNaN(percentage) && percentage <= 100) {
      discount = (percentage / 100) * subtotal;
      result.percentage = percentage;
    }
  } else {
    const fixedDiscount = parseFloat(input);
    if (!isNaN(fixedDiscount)) {
      discount = fixedDiscount;
      result.fixed = fixedDiscount;
      const percentageFromFixed = (fixedDiscount / subtotal) * 100;
      result.percentage = parseFloat(percentageFromFixed.toFixed(2));
    }
  }
  const discountRounded = Math.round(discount * 100) / 100;
  return { ...result, discount: discountRounded };
};
