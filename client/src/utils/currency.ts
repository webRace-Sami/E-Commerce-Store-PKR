/**
 * Format numbers into Pakistani Rupee (PKR) representation
 * @example formatPKR(46500) => "₨ 46,500"
 */
export const formatPKR = (amount: number, options?: { showCode?: boolean }): string => {
  if (isNaN(amount)) return '₨ 0';
  const formattedNumber = new Intl.NumberFormat('en-PK', {
    maximumFractionDigits: 0
  }).format(amount);

  if (options?.showCode) {
    return `PKR ${formattedNumber}`;
  }

  return `₨ ${formattedNumber}`;
};

/**
 * Calculate savings and discount percentage between original and sale price
 */
export const calculateSavings = (price: number, originalPrice?: number) => {
  if (!originalPrice || originalPrice <= price) {
    return null;
  }
  const savingAmount = originalPrice - price;
  const percentage = Math.round((savingAmount / originalPrice) * 100);
  return {
    savingAmount,
    savingFormatted: formatPKR(savingAmount),
    percentage
  };
};
